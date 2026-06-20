import { Router } from "express";
import { db } from "@workspace/db";
import { visaCasesTable, visaChecklistItemsTable, candidatesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

const VISA_CHECKLIST = [
  { item: "Valid passport (minimum 6 months validity)", required: true },
  { item: "Signed job offer letter from employer", required: true },
  { item: "Qualification recognition result or evidence", required: true },
  { item: "German language certificate (A2/B1 minimum)", required: true },
  { item: "Health insurance coverage confirmation", required: true },
  { item: "Financial documents / bank statements", required: false },
  { item: "Visa appointment booked", required: true },
  { item: "Visa application form completed", required: true },
  { item: "Visa application submitted to German consulate", required: true },
  { item: "Visa decision received", required: true },
  { item: "Travel booking confirmed", required: false },
];

router.get("/visa-cases", async (_req, res) => {
  try {
    const cases = await db.select().from(visaCasesTable);
    const enriched = await Promise.all(cases.map(async vc => {
      const [candidate] = await db.select({ userId: candidatesTable.userId }).from(candidatesTable).where(eq(candidatesTable.id, vc.candidateId)).limit(1);
      const [user] = candidate ? await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, candidate.userId)).limit(1) : [null];
      const checklist = await db.select().from(visaChecklistItemsTable).where(eq(visaChecklistItemsTable.visaCaseId, vc.id));
      const completed = checklist.filter(i => i.completed).length;
      return { ...vc, candidateName: user?.name ?? null, checklistProgress: completed, checklistTotal: checklist.length };
    }));
    res.json(enriched);
  } catch (err) {
    logger.error({ err }, "listVisaCases error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/visa-cases", async (req, res) => {
  try {
    const [vc] = await db.insert(visaCasesTable).values(req.body).returning();
    await db.insert(visaChecklistItemsTable).values(
      VISA_CHECKLIST.map(ci => ({ visaCaseId: vc.id, item: ci.item, required: ci.required, completed: false }))
    );
    res.status(201).json({ ...vc, candidateName: null, checklistProgress: 0, checklistTotal: VISA_CHECKLIST.length });
  } catch (err) {
    logger.error({ err }, "createVisaCase error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/visa-cases/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [vc] = await db.select().from(visaCasesTable).where(eq(visaCasesTable.id, id)).limit(1);
    if (!vc) { res.status(404).json({ error: "Not found" }); return; }
    const [candidate] = await db.select({ userId: candidatesTable.userId }).from(candidatesTable).where(eq(candidatesTable.id, vc.candidateId)).limit(1);
    const [user] = candidate ? await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, candidate.userId)).limit(1) : [null];
    const checklist = await db.select().from(visaChecklistItemsTable).where(eq(visaChecklistItemsTable.visaCaseId, id));
    res.json({ ...vc, candidateName: user?.name ?? null, checklistProgress: checklist.filter(i => i.completed).length, checklistTotal: checklist.length });
  } catch (err) {
    logger.error({ err }, "getVisaCase error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/visa-cases/:id", async (req, res) => {
  try {
    const [result] = await db.update(visaCasesTable).set(req.body).where(eq(visaCasesTable.id, parseInt(req.params.id))).returning();
    if (!result) { res.status(404).json({ error: "Not found" }); return; }
    const checklist = await db.select().from(visaChecklistItemsTable).where(eq(visaChecklistItemsTable.visaCaseId, result.id));
    res.json({ ...result, candidateName: null, checklistProgress: checklist.filter(i => i.completed).length, checklistTotal: checklist.length });
  } catch (err) {
    logger.error({ err }, "updateVisaCase error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/visa-cases/:id/checklist", async (req, res) => {
  try {
    const items = await db.select().from(visaChecklistItemsTable).where(eq(visaChecklistItemsTable.visaCaseId, parseInt(req.params.id)));
    res.json(items);
  } catch (err) {
    logger.error({ err }, "getVisaChecklist error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/visa-cases/:id/checklist/:itemId", async (req, res) => {
  try {
    const { completed } = req.body as { completed: boolean };
    const [result] = await db.update(visaChecklistItemsTable).set({ completed, completedAt: completed ? new Date() : null }).where(eq(visaChecklistItemsTable.id, parseInt(req.params.itemId))).returning();
    if (!result) { res.status(404).json({ error: "Not found" }); return; }
    res.json(result);
  } catch (err) {
    logger.error({ err }, "updateVisaChecklistItem error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
