import { Router } from "express";
import { db } from "@workspace/db";
import { interviewsTable, candidatesTable, employersTable, vacanciesTable, applicationsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

async function enrichInterview(i: typeof interviewsTable.$inferSelect) {
  const [candidate] = await db.select({ userId: candidatesTable.userId }).from(candidatesTable).where(eq(candidatesTable.id, i.candidateId)).limit(1);
  const [user] = candidate ? await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, candidate.userId)).limit(1) : [null];
  const [employer] = await db.select({ companyName: employersTable.companyName }).from(employersTable).where(eq(employersTable.id, i.employerId)).limit(1);
  const [app] = await db.select({ vacancyId: applicationsTable.vacancyId }).from(applicationsTable).where(eq(applicationsTable.id, i.applicationId)).limit(1);
  const [vacancy] = app ? await db.select({ title: vacanciesTable.title }).from(vacanciesTable).where(eq(vacanciesTable.id, app.vacancyId)).limit(1) : [null];
  return { ...i, candidateName: user?.name ?? null, employerName: employer?.companyName ?? null, vacancyTitle: vacancy?.title ?? null };
}

router.get("/interviews", async (_req, res) => {
  try {
    const rows = await db.select().from(interviewsTable);
    res.json(await Promise.all(rows.map(enrichInterview)));
  } catch (err) {
    logger.error({ err }, "listInterviews error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/interviews", async (req, res) => {
  try {
    const [interview] = await db.insert(interviewsTable).values(req.body).returning();
    res.status(201).json(await enrichInterview(interview));
  } catch (err) {
    logger.error({ err }, "scheduleInterview error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/interviews/:id", async (req, res) => {
  try {
    const [i] = await db.select().from(interviewsTable).where(eq(interviewsTable.id, parseInt(req.params.id))).limit(1);
    if (!i) { res.status(404).json({ error: "Not found" }); return; }
    res.json(await enrichInterview(i));
  } catch (err) {
    logger.error({ err }, "getInterview error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/interviews/:id", async (req, res) => {
  try {
    const [result] = await db.update(interviewsTable).set(req.body).where(eq(interviewsTable.id, parseInt(req.params.id))).returning();
    if (!result) { res.status(404).json({ error: "Not found" }); return; }
    res.json(await enrichInterview(result));
  } catch (err) {
    logger.error({ err }, "updateInterview error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
