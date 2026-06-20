import { Router } from "express";
import { db } from "@workspace/db";
import { offersTable, candidatesTable, employersTable, applicationsTable, vacanciesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

async function enrichOffer(o: typeof offersTable.$inferSelect) {
  const [candidate] = await db.select({ userId: candidatesTable.userId }).from(candidatesTable).where(eq(candidatesTable.id, o.candidateId)).limit(1);
  const [user] = candidate ? await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, candidate.userId)).limit(1) : [null];
  const [employer] = await db.select({ companyName: employersTable.companyName }).from(employersTable).where(eq(employersTable.id, o.employerId)).limit(1);
  const [app] = await db.select({ vacancyId: applicationsTable.vacancyId }).from(applicationsTable).where(eq(applicationsTable.id, o.applicationId)).limit(1);
  const [vacancy] = app ? await db.select({ title: vacanciesTable.title }).from(vacanciesTable).where(eq(vacanciesTable.id, app.vacancyId)).limit(1) : [null];
  return { ...o, candidateName: user?.name ?? null, employerName: employer?.companyName ?? null, vacancyTitle: vacancy?.title ?? null };
}

router.get("/offers", async (_req, res) => {
  try {
    const rows = await db.select().from(offersTable);
    res.json(await Promise.all(rows.map(enrichOffer)));
  } catch (err) {
    logger.error({ err }, "listOffers error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/offers", async (req, res) => {
  try {
    const [offer] = await db.insert(offersTable).values(req.body).returning();
    res.status(201).json(await enrichOffer(offer));
  } catch (err) {
    logger.error({ err }, "createOffer error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/offers/:id", async (req, res) => {
  try {
    const [o] = await db.select().from(offersTable).where(eq(offersTable.id, parseInt(req.params.id))).limit(1);
    if (!o) { res.status(404).json({ error: "Not found" }); return; }
    res.json(await enrichOffer(o));
  } catch (err) {
    logger.error({ err }, "getOffer error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/offers/:id", async (req, res) => {
  try {
    const [result] = await db.update(offersTable).set(req.body).where(eq(offersTable.id, parseInt(req.params.id))).returning();
    if (!result) { res.status(404).json({ error: "Not found" }); return; }
    res.json(await enrichOffer(result));
  } catch (err) {
    logger.error({ err }, "updateOffer error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
