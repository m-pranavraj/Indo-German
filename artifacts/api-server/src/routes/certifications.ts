import { Router } from "express";
import { db } from "@workspace/db";
import { certificationsTable, candidatesTable, usersTable } from "@workspace/db";
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

router.get("/certifications", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.userId, userId)).limit(1);
    if (!candidate) { res.json([]); return; }
    const certs = await db.select().from(certificationsTable).where(eq(certificationsTable.candidateId, candidate.id));
    res.json(certs);
  } catch (err) {
    logger.error({ err }, "listCertifications error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/certifications/candidate/:candidateId", async (req, res) => {
  try {
    const candidateId = parseInt(req.params.candidateId);
    const certs = await db.select().from(certificationsTable).where(eq(certificationsTable.candidateId, candidateId));
    res.json(certs);
  } catch (err) {
    logger.error({ err }, "getCandidateCertifications error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/certifications", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.userId, userId)).limit(1);
    if (!candidate) { res.status(403).json({ error: "Not a candidate" }); return; }
    const [cert] = await db.insert(certificationsTable).values({ ...req.body, candidateId: candidate.id }).returning();
    res.status(201).json(cert);
  } catch (err) {
    logger.error({ err }, "createCertification error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/certifications/:id", async (req, res) => {
  try {
    const [result] = await db.update(certificationsTable).set(req.body).where(eq(certificationsTable.id, parseInt(req.params.id))).returning();
    if (!result) { res.status(404).json({ error: "Not found" }); return; }
    res.json(result);
  } catch (err) {
    logger.error({ err }, "updateCertification error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/certifications/:id", async (req, res) => {
  try {
    await db.delete(certificationsTable).where(eq(certificationsTable.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "deleteCertification error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
