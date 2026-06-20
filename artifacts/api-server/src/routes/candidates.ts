import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, candidatesTable, documentsTable, recognitionCasesTable, visaCasesTable } from "@workspace/db";
import { eq, and, gte, sql } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

function getUserId(req: any): number | null {
  const auth = req.headers.authorization as string | undefined;
  if (!auth) return null;
  const token = auth.replace("Bearer ", "");
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const id = parseInt(decoded.split(":")[0]);
    return isNaN(id) ? null : id;
  } catch { return null; }
}

function computeReadiness(candidate: any, docs: any[]): number {
  let score = 0;
  const hasOccupation = !!candidate.occupation;
  const hasDistrict = !!candidate.district;
  const hasEducation = !!candidate.educationLevel;
  const hasExperience = !!candidate.experienceYears;
  const hasLanguage = !!candidate.germanLanguageLevel;
  const hasPassport = candidate.passportAvailable;
  const profileFields = [hasOccupation, hasDistrict, hasEducation, hasExperience, hasLanguage].filter(Boolean).length;
  score += Math.round((profileFields / 5) * 10);
  const verifiedDocs = docs.filter(d => d.verificationStatus === "verified").length;
  score += Math.min(15, Math.round((verifiedDocs / 5) * 15));
  score += hasPassport ? 10 : 0;
  score += hasEducation ? 10 : 0;
  const langMap: Record<string, number> = { A1: 5, A2: 10, B1: 15, B2: 20, C1: 20 };
  score += langMap[candidate.germanLanguageLevel ?? ""] ?? 0;
  const expYears = candidate.experienceYears ?? 0;
  score += expYears >= 3 ? 10 : expYears >= 1 ? 5 : 0;
  return Math.min(100, score);
}

router.get("/candidates", async (req, res) => {
  try {
    const { stage, occupation, district } = req.query as Record<string, string>;
    const rows = await db.select({
      candidate: candidatesTable,
      user: { name: usersTable.name, email: usersTable.email },
    }).from(candidatesTable).innerJoin(usersTable, eq(candidatesTable.userId, usersTable.id));

    let filtered = rows;
    if (stage) filtered = filtered.filter(r => r.candidate.stage === stage);
    if (occupation) filtered = filtered.filter(r => r.candidate.occupation?.toLowerCase().includes(occupation.toLowerCase()));
    if (district) filtered = filtered.filter(r => r.candidate.district?.toLowerCase().includes(district.toLowerCase()));

    res.json(filtered.map(r => ({
      ...r.candidate,
      name: r.user.name,
      email: r.user.email,
    })));
  } catch (err) {
    logger.error({ err }, "listCandidates error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/candidates/me", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const rows = await db.select({
      candidate: candidatesTable,
      user: { name: usersTable.name, email: usersTable.email },
    }).from(candidatesTable).innerJoin(usersTable, eq(candidatesTable.userId, usersTable.id)).where(eq(candidatesTable.userId, userId)).limit(1);
    if (!rows.length) { res.status(404).json({ error: "Candidate not found" }); return; }
    const r = rows[0];
    res.json({ ...r.candidate, name: r.user.name, email: r.user.email });
  } catch (err) {
    logger.error({ err }, "getMyCandidateProfile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/candidates/me", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [existing] = await db.select().from(candidatesTable).where(eq(candidatesTable.userId, userId)).limit(1);
    if (!existing) { res.status(404).json({ error: "Not found" }); return; }
    const docs = await db.select().from(documentsTable).where(eq(documentsTable.candidateId, existing.id));
    const updated = { ...existing, ...req.body };
    const score = computeReadiness(updated, docs);
    const [result] = await db.update(candidatesTable).set({ ...req.body, readinessScore: score }).where(eq(candidatesTable.userId, userId)).returning();
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    res.json({ ...result, name: user.name, email: user.email });
  } catch (err) {
    logger.error({ err }, "updateMyCandidateProfile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/candidates/me/readiness", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.userId, userId)).limit(1);
    if (!candidate) { res.status(404).json({ error: "Not found" }); return; }
    const docs = await db.select().from(documentsTable).where(eq(documentsTable.candidateId, candidate.id));
    const verifiedDocs = docs.filter(d => d.verificationStatus === "verified").length;
    const profileFields = [candidate.occupation, candidate.district, candidate.educationLevel, candidate.experienceYears, candidate.germanLanguageLevel].filter(Boolean).length;
    const langMap: Record<string, number> = { A1: 5, A2: 10, B1: 15, B2: 20, C1: 20 };
    const langScore = langMap[candidate.germanLanguageLevel ?? ""] ?? 0;
    const expYears = candidate.experienceYears ?? 0;
    const components = {
      profileCompleteness: Math.round((profileFields / 5) * 10),
      identityDocuments: Math.min(15, Math.round((verifiedDocs / 5) * 15)),
      passportValidity: candidate.passportAvailable ? 10 : 0,
      qualificationSuitability: candidate.educationLevel ? 10 : 0,
      recognitionStatus: 5,
      germanLanguageLevel: langScore,
      workExperience: expYears >= 3 ? 10 : expYears >= 1 ? 5 : 0,
      employerJobMatch: 5,
    };
    const total = Object.values(components).reduce((a, b) => a + b, 0);
    const label = total >= 82 ? "Germany-Ready" : total >= 60 ? "Pathway Active" : total >= 40 ? "Training Required" : "Early Stage";
    const nextActions: string[] = [];
    if (!candidate.passportAvailable) nextActions.push("Obtain and upload your passport");
    if (!candidate.germanLanguageLevel || langScore < 10) nextActions.push("Enroll in German language training (A2 or higher)");
    if (verifiedDocs < 3) nextActions.push("Upload and verify identity documents");
    if (!candidate.occupation) nextActions.push("Complete your occupation profile");
    if (!candidate.experienceYears) nextActions.push("Add your work experience details");
    res.json({ total, label, components, nextActions });
  } catch (err) {
    logger.error({ err }, "getReadinessScore error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/candidates/me/journey", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.userId, userId)).limit(1);
    if (!candidate) { res.status(404).json({ error: "Not found" }); return; }
    const stageOrder = [
      "discovery", "registration", "eligibility", "language_training",
      "qualification_recognition", "document_vault", "employer_matching",
      "interview_offer", "visa_readiness", "post_arrival",
    ];
    const stageLabels: Record<string, string> = {
      discovery: "Discovery & Awareness",
      registration: "Registration & Identity",
      eligibility: "Eligibility Assessment",
      language_training: "Language & Training",
      qualification_recognition: "Qualification Recognition",
      document_vault: "Document Vault",
      employer_matching: "Employer Matching",
      interview_offer: "Interview & Offer",
      visa_readiness: "Visa Readiness",
      post_arrival: "Post-Arrival Welfare",
    };
    const currentIdx = stageOrder.indexOf(candidate.stage);
    const stages = stageOrder.map((id, i) => ({
      id,
      name: stageLabels[id] ?? id,
      order: i + 1,
      status: i < currentIdx ? "completed" : i === currentIdx ? "active" : "pending",
      completedAt: i < currentIdx ? new Date(Date.now() - (currentIdx - i) * 7 * 24 * 3600000).toISOString() : null,
      details: null,
    }));
    res.json({ candidateId: candidate.id, currentStage: candidate.stage, stages });
  } catch (err) {
    logger.error({ err }, "getMyJourney error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/candidates/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const rows = await db.select({
      candidate: candidatesTable,
      user: { name: usersTable.name, email: usersTable.email },
    }).from(candidatesTable).innerJoin(usersTable, eq(candidatesTable.userId, usersTable.id)).where(eq(candidatesTable.id, id)).limit(1);
    if (!rows.length) { res.status(404).json({ error: "Not found" }); return; }
    const r = rows[0];
    res.json({ ...r.candidate, name: r.user.name, email: r.user.email });
  } catch (err) {
    logger.error({ err }, "getCandidate error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
