import { Router } from "express";
import { db } from "@workspace/db";
import { vacanciesTable, employersTable, applicationsTable, candidatesTable, usersTable } from "@workspace/db";
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

router.get("/vacancies", async (req, res) => {
  try {
    const { occupation, location } = req.query as Record<string, string>;
    const rows = await db.select({
      vacancy: vacanciesTable,
      employer: { companyName: employersTable.companyName },
    }).from(vacanciesTable).innerJoin(employersTable, eq(vacanciesTable.employerId, employersTable.id));
    let filtered = rows;
    if (occupation) filtered = filtered.filter(r => r.vacancy.occupation.toLowerCase().includes(occupation.toLowerCase()));
    if (location) filtered = filtered.filter(r => r.vacancy.location.toLowerCase().includes(location.toLowerCase()));
    const appCounts = await db.select({ vacancyId: applicationsTable.vacancyId, cnt: count() }).from(applicationsTable).groupBy(applicationsTable.vacancyId);
    const countMap: Record<number, number> = {};
    appCounts.forEach(a => { countMap[a.vacancyId] = Number(a.cnt); });
    res.json(filtered.map(r => ({ ...r.vacancy, employerName: r.employer.companyName, applicantsCount: countMap[r.vacancy.id] ?? 0 })));
  } catch (err) {
    logger.error({ err }, "listVacancies error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/vacancies", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [employer] = await db.select().from(employersTable).where(eq(employersTable.userId, userId)).limit(1);
    if (!employer) { res.status(403).json({ error: "Not an employer" }); return; }
    const [vacancy] = await db.insert(vacanciesTable).values({ ...req.body, employerId: employer.id }).returning();
    res.status(201).json({ ...vacancy, employerName: employer.companyName, applicantsCount: 0 });
  } catch (err) {
    logger.error({ err }, "createVacancy error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/vacancies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const rows = await db.select({
      vacancy: vacanciesTable,
      employer: { companyName: employersTable.companyName },
    }).from(vacanciesTable).innerJoin(employersTable, eq(vacanciesTable.employerId, employersTable.id)).where(eq(vacanciesTable.id, id)).limit(1);
    if (!rows.length) { res.status(404).json({ error: "Not found" }); return; }
    const apps = await db.select().from(applicationsTable).where(eq(applicationsTable.vacancyId, id));
    res.json({ ...rows[0].vacancy, employerName: rows[0].employer.companyName, applicantsCount: apps.length });
  } catch (err) {
    logger.error({ err }, "getVacancy error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/vacancies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [result] = await db.update(vacanciesTable).set(req.body).where(eq(vacanciesTable.id, id)).returning();
    if (!result) { res.status(404).json({ error: "Not found" }); return; }
    const [employer] = await db.select().from(employersTable).where(eq(employersTable.id, result.employerId)).limit(1);
    res.json({ ...result, employerName: employer?.companyName ?? null, applicantsCount: 0 });
  } catch (err) {
    logger.error({ err }, "updateVacancy error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/vacancies/:id/matches", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [vacancy] = await db.select().from(vacanciesTable).where(eq(vacanciesTable.id, id)).limit(1);
    if (!vacancy) { res.status(404).json({ error: "Not found" }); return; }
    const candidates = await db.select({
      candidate: candidatesTable,
      user: { name: usersTable.name },
    }).from(candidatesTable).innerJoin(usersTable, eq(candidatesTable.userId, usersTable.id));

    const matches = candidates.map(r => {
      let fit = 0;
      if (r.candidate.occupation?.toLowerCase() === vacancy.occupation.toLowerCase()) fit += 40;
      else if (r.candidate.occupation?.toLowerCase().includes(vacancy.occupation.toLowerCase().split(" ")[0])) fit += 20;
      const langMap: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
      const reqLevel = langMap[vacancy.languageLevel ?? ""] ?? 2;
      const candLevel = langMap[r.candidate.germanLanguageLevel ?? ""] ?? 0;
      if (candLevel >= reqLevel) fit += 20;
      else if (candLevel === reqLevel - 1) fit += 10;
      fit += Math.round((r.candidate.readinessScore / 100) * 20);
      fit += Math.min(20, (r.candidate.experienceYears ?? 0) * 4);
      return {
        candidateId: r.candidate.id,
        name: r.user.name,
        occupation: r.candidate.occupation,
        germanLanguageLevel: r.candidate.germanLanguageLevel,
        fitScore: Math.min(100, fit),
        stage: r.candidate.stage,
        readinessScore: r.candidate.readinessScore,
        district: r.candidate.district,
        experienceYears: r.candidate.experienceYears,
      };
    });
    matches.sort((a, b) => b.fitScore - a.fitScore);
    res.json(matches.slice(0, 20));
  } catch (err) {
    logger.error({ err }, "getVacancyMatches error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
