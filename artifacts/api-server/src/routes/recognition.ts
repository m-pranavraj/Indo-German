import { Router } from "express";
import { db } from "@workspace/db";
import { recognitionCasesTable, candidatesTable, usersTable } from "@workspace/db";
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

async function enrichCase(c: typeof recognitionCasesTable.$inferSelect) {
  const [candidate] = await db.select({ userId: candidatesTable.userId }).from(candidatesTable).where(eq(candidatesTable.id, c.candidateId)).limit(1);
  const [user] = candidate ? await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, candidate.userId)).limit(1) : [null];
  return { ...c, candidateName: user?.name ?? null };
}

router.get("/recognition", async (_req, res) => {
  try {
    const cases = await db.select().from(recognitionCasesTable);
    res.json(await Promise.all(cases.map(enrichCase)));
  } catch (err) {
    logger.error({ err }, "listRecognitionCases error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/recognition", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.userId, userId)).limit(1);
    if (!candidate) { res.status(403).json({ error: "Not a candidate" }); return; }
    const [c] = await db.insert(recognitionCasesTable).values({ ...req.body, candidateId: candidate.id }).returning();
    res.status(201).json(await enrichCase(c));
  } catch (err) {
    logger.error({ err }, "createRecognitionCase error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/recognition/:id", async (req, res) => {
  try {
    const [c] = await db.select().from(recognitionCasesTable).where(eq(recognitionCasesTable.id, parseInt(req.params.id))).limit(1);
    if (!c) { res.status(404).json({ error: "Not found" }); return; }
    res.json(await enrichCase(c));
  } catch (err) {
    logger.error({ err }, "getRecognitionCase error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/recognition/:id", async (req, res) => {
  try {
    const [result] = await db.update(recognitionCasesTable).set(req.body).where(eq(recognitionCasesTable.id, parseInt(req.params.id))).returning();
    if (!result) { res.status(404).json({ error: "Not found" }); return; }
    res.json(await enrichCase(result));
  } catch (err) {
    logger.error({ err }, "updateRecognitionCase error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
