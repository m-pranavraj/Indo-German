import { Router } from "express";
import { db } from "@workspace/db";
import { applicationsTable, candidatesTable, vacanciesTable, employersTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
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

async function enrichApplication(app: typeof applicationsTable.$inferSelect) {
  const vacancy = await db.select({ title: vacanciesTable.title, employerId: vacanciesTable.employerId }).from(vacanciesTable).where(eq(vacanciesTable.id, app.vacancyId)).limit(1);
  const candidate = await db.select({ userId: candidatesTable.userId }).from(candidatesTable).where(eq(candidatesTable.id, app.candidateId)).limit(1);
  let candidateName: string | null = null;
  if (candidate[0]) {
    const user = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, candidate[0].userId)).limit(1);
    candidateName = user[0]?.name ?? null;
  }
  let employerName: string | null = null;
  if (vacancy[0]) {
    const emp = await db.select({ companyName: employersTable.companyName }).from(employersTable).where(eq(employersTable.id, vacancy[0].employerId)).limit(1);
    employerName = emp[0]?.companyName ?? null;
  }
  return {
    ...app,
    candidateName,
    vacancyTitle: vacancy[0]?.title ?? null,
    employerName,
  };
}

router.get("/applications", async (req, res) => {
  try {
    const { status, vacancyId } = req.query as { status?: string; vacancyId?: string };
    let rows = await db.select().from(applicationsTable);
    if (status) rows = rows.filter(a => a.status === status);
    if (vacancyId) rows = rows.filter(a => a.vacancyId === parseInt(vacancyId));
    const enriched = await Promise.all(rows.map(enrichApplication));
    res.json(enriched);
  } catch (err) {
    logger.error({ err }, "listApplications error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/applications", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.userId, userId)).limit(1);
    if (!candidate) { res.status(403).json({ error: "Not a candidate" }); return; }
    const [app] = await db.insert(applicationsTable).values({ candidateId: candidate.id, vacancyId: req.body.vacancyId, coverNote: req.body.coverNote ?? null }).returning();
    res.status(201).json(await enrichApplication(app));
  } catch (err) {
    logger.error({ err }, "createApplication error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/applications/:id", async (req, res) => {
  try {
    const [app] = await db.select().from(applicationsTable).where(eq(applicationsTable.id, parseInt(req.params.id))).limit(1);
    if (!app) { res.status(404).json({ error: "Not found" }); return; }
    res.json(await enrichApplication(app));
  } catch (err) {
    logger.error({ err }, "getApplication error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/applications/:id", async (req, res) => {
  try {
    const [result] = await db.update(applicationsTable).set(req.body).where(eq(applicationsTable.id, parseInt(req.params.id))).returning();
    if (!result) { res.status(404).json({ error: "Not found" }); return; }
    res.json(await enrichApplication(result));
  } catch (err) {
    logger.error({ err }, "updateApplication error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
