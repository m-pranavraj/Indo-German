import { Router } from "express";
import { db } from "@workspace/db";
import { documentsTable, candidatesTable } from "@workspace/db";
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

router.get("/documents", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.userId, userId)).limit(1);
    if (!candidate) { res.json([]); return; }
    const docs = await db.select().from(documentsTable).where(eq(documentsTable.candidateId, candidate.id));
    res.json(docs);
  } catch (err) {
    logger.error({ err }, "listDocuments error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/documents", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.userId, userId)).limit(1);
    if (!candidate) { res.status(403).json({ error: "Not a candidate" }); return; }
    const [doc] = await db.insert(documentsTable).values({ ...req.body, candidateId: candidate.id }).returning();
    res.status(201).json(doc);
  } catch (err) {
    logger.error({ err }, "uploadDocument error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/documents/:id", async (req, res) => {
  try {
    const [doc] = await db.select().from(documentsTable).where(eq(documentsTable.id, parseInt(req.params.id))).limit(1);
    if (!doc) { res.status(404).json({ error: "Not found" }); return; }
    res.json(doc);
  } catch (err) {
    logger.error({ err }, "getDocument error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/documents/:id", async (req, res) => {
  try {
    const [result] = await db.update(documentsTable).set(req.body).where(eq(documentsTable.id, parseInt(req.params.id))).returning();
    if (!result) { res.status(404).json({ error: "Not found" }); return; }
    res.json(result);
  } catch (err) {
    logger.error({ err }, "updateDocument error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/documents/:id/verify", async (req, res) => {
  try {
    const { status, reviewerNotes } = req.body as { status: "verified" | "rejected"; reviewerNotes?: string };
    const [result] = await db.update(documentsTable).set({ verificationStatus: status, reviewerNotes: reviewerNotes ?? null }).where(eq(documentsTable.id, parseInt(req.params.id))).returning();
    if (!result) { res.status(404).json({ error: "Not found" }); return; }
    res.json(result);
  } catch (err) {
    logger.error({ err }, "verifyDocument error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
