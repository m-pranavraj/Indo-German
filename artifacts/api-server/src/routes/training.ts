import { Router } from "express";
import { db } from "@workspace/db";
import { coursesTable, batchesTable, enrollmentsTable, candidatesTable, usersTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

function getUserId(req: any): number | null {
  const auth = req.headers.authorization as string | undefined;
  if (!auth) return null;
  try {
    const decoded = Buffer.from(auth.replace("Bearer ", ""), "base64").toString();
    const id = parseInt(decoded.split(":")[0]);
    return isNaN(id) ? null : id;
  } catch { return null; }
}

router.get("/courses", async (_req, res) => {
  try {
    const courses = await db.select().from(coursesTable);
    const enrollCounts = await db.select({ courseId: batchesTable.courseId, cnt: count() }).from(batchesTable).groupBy(batchesTable.courseId);
    const countMap: Record<number, number> = {};
    enrollCounts.forEach(e => { countMap[e.courseId] = Number(e.cnt); });
    const withProvider = await Promise.all(courses.map(async c => {
      const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, c.providerId)).limit(1);
      return { ...c, providerName: user?.name ?? "Unknown Institute", enrolledCount: countMap[c.id] ?? 0 };
    }));
    res.json(withProvider);
  } catch (err) {
    logger.error({ err }, "listCourses error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/courses", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [course] = await db.insert(coursesTable).values({ ...req.body, providerId: userId }).returning();
    const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    res.status(201).json({ ...course, providerName: user?.name ?? "Unknown", enrolledCount: 0 });
  } catch (err) {
    logger.error({ err }, "createCourse error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/batches", async (_req, res) => {
  try {
    const batches = await db.select().from(batchesTable);
    const result = await Promise.all(batches.map(async b => {
      const [course] = await db.select({ name: coursesTable.name, languageLevel: coursesTable.languageLevel }).from(coursesTable).where(eq(coursesTable.id, b.courseId)).limit(1);
      const enrollments = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.batchId, b.id));
      const avgAtt = enrollments.length > 0 ? Math.round(enrollments.reduce((s, e) => s + (e.attendancePercent ?? 0), 0) / enrollments.length) : null;
      return { ...b, courseName: course?.name ?? "", enrolledCount: enrollments.length, attendancePercent: avgAtt };
    }));
    res.json(result);
  } catch (err) {
    logger.error({ err }, "listBatches error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/batches", async (req, res) => {
  try {
    const [batch] = await db.insert(batchesTable).values(req.body).returning();
    const [course] = await db.select({ name: coursesTable.name }).from(coursesTable).where(eq(coursesTable.id, batch.courseId)).limit(1);
    res.status(201).json({ ...batch, courseName: course?.name ?? "", enrolledCount: 0, attendancePercent: null });
  } catch (err) {
    logger.error({ err }, "createBatch error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/batches/:id/enroll", async (req, res) => {
  try {
    const batchId = parseInt(req.params.id);
    const { candidateId } = req.body as { candidateId: number };
    const [enrollment] = await db.insert(enrollmentsTable).values({ batchId, candidateId, certificateIssued: false }).returning();
    const [batch] = await db.select().from(batchesTable).where(eq(batchesTable.id, batchId)).limit(1);
    const [course] = batch ? await db.select().from(coursesTable).where(eq(coursesTable.id, batch.courseId)).limit(1) : [null];
    const [candidate] = await db.select({ userId: candidatesTable.userId }).from(candidatesTable).where(eq(candidatesTable.id, candidateId)).limit(1);
    const [user] = candidate ? await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, candidate.userId)).limit(1) : [null];
    res.status(201).json({ ...enrollment, candidateName: user?.name ?? null, batchName: course?.name ?? null, languageLevel: course?.languageLevel ?? null });
  } catch (err) {
    logger.error({ err }, "enrollInBatch error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/enrollments", async (_req, res) => {
  try {
    const enrollments = await db.select().from(enrollmentsTable);
    const enriched = await Promise.all(enrollments.map(async e => {
      const [batch] = await db.select().from(batchesTable).where(eq(batchesTable.id, e.batchId)).limit(1);
      const [course] = batch ? await db.select().from(coursesTable).where(eq(coursesTable.id, batch.courseId)).limit(1) : [null];
      const [candidate] = await db.select({ userId: candidatesTable.userId }).from(candidatesTable).where(eq(candidatesTable.id, e.candidateId)).limit(1);
      const [user] = candidate ? await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, candidate.userId)).limit(1) : [null];
      return { ...e, candidateName: user?.name ?? null, batchName: course?.name ?? null, languageLevel: course?.languageLevel ?? null };
    }));
    res.json(enriched);
  } catch (err) {
    logger.error({ err }, "listEnrollments error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/training/dashboard", async (_req, res) => {
  try {
    const batches = await db.select().from(batchesTable);
    const activeBatches = batches.filter(b => b.status === "active").length;
    const enrollments = await db.select().from(enrollmentsTable);
    const studentsEnrolled = enrollments.filter(e => e.status !== "dropped").length;
    const avgAttendance = enrollments.length > 0 ? Math.round(enrollments.reduce((s, e) => s + (e.attendancePercent ?? 0), 0) / enrollments.length) : 0;
    const certificatesIssued = enrollments.filter(e => e.certificateIssued).length;
    const courses = await db.select().from(coursesTable);
    const completionByLevel = (["A1", "A2", "B1", "B2", "C1"] as const).map(level => {
      const levelCourses = courses.filter(c => c.languageLevel === level).map(c => c.id);
      const levelBatches = batches.filter(b => levelCourses.includes(b.courseId)).map(b => b.id);
      const levelEnrolled = enrollments.filter(e => levelBatches.includes(e.batchId));
      return { level, completed: levelEnrolled.filter(e => e.status === "passed").length, total: levelEnrolled.length };
    });
    res.json({ activeBatches, studentsEnrolled, avgAttendance, completionByLevel, certificatesIssued, placementOutcomes: Math.round(certificatesIssued * 0.7) });
  } catch (err) {
    logger.error({ err }, "getTrainingDashboard error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
