import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, employersTable, vacanciesTable, applicationsTable, interviewsTable, offersTable, candidatesTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

function getUserId(req: any): number | null {
  const auth = req.headers.authorization as string | undefined;
  if (!auth) return null;
  try {
    const token = auth.replace("Bearer ", "");
    const decoded = Buffer.from(token, "base64").toString();
    const id = parseInt(decoded.split(":")[0]);
    return isNaN(id) ? null : id;
  } catch { return null; }
}

router.get("/employers", async (_req, res) => {
  try {
    const rows = await db.select().from(employersTable);
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "listEmployers error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/employers/me", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [employer] = await db.select().from(employersTable).where(eq(employersTable.userId, userId)).limit(1);
    if (!employer) { res.status(404).json({ error: "Not found" }); return; }
    res.json(employer);
  } catch (err) {
    logger.error({ err }, "getMyEmployerProfile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/employers/me", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [result] = await db.update(employersTable).set(req.body).where(eq(employersTable.userId, userId)).returning();
    if (!result) { res.status(404).json({ error: "Not found" }); return; }
    res.json(result);
  } catch (err) {
    logger.error({ err }, "updateMyEmployerProfile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/employers/me/dashboard", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [employer] = await db.select().from(employersTable).where(eq(employersTable.userId, userId)).limit(1);
    if (!employer) { res.status(404).json({ error: "Not found" }); return; }

    const vacancies = await db.select().from(vacanciesTable).where(eq(vacanciesTable.employerId, employer.id));
    const activeVacancies = vacancies.filter(v => v.status === "active").length;
    const vacancyIds = vacancies.map(v => v.id);
    const applications = vacancyIds.length > 0
      ? await db.select().from(applicationsTable)
      : [];
    const shortlisted = applications.filter(a => a.status === "shortlisted").length;
    const interviews = await db.select().from(interviewsTable).where(eq(interviewsTable.employerId, employer.id));
    const offers = await db.select().from(offersTable).where(eq(offersTable.employerId, employer.id));

    const candidates = await db.select({ readinessScore: candidatesTable.readinessScore }).from(candidatesTable);
    const distribution = [
      { label: "Germany-Ready (82-100)", count: candidates.filter(c => c.readinessScore >= 82).length },
      { label: "Pathway Active (60-81)", count: candidates.filter(c => c.readinessScore >= 60 && c.readinessScore < 82).length },
      { label: "Training Required (40-59)", count: candidates.filter(c => c.readinessScore >= 40 && c.readinessScore < 60).length },
      { label: "Early Stage (0-39)", count: candidates.filter(c => c.readinessScore < 40).length },
    ];

    res.json({
      activeVacancies,
      candidatesMatched: applications.length,
      shortlisted,
      interviewsScheduled: interviews.filter(i => i.status === "scheduled").length,
      offersIssued: offers.length,
      joiningForecast: offers.filter(o => o.status === "accepted").length,
      readinessDistribution: distribution,
    });
  } catch (err) {
    logger.error({ err }, "getEmployerDashboard error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
