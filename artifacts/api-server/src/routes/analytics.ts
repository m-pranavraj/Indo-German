import { Router } from "express";
import { db } from "@workspace/db";
import { candidatesTable, vacanciesTable, recognitionCasesTable, visaCasesTable, welfareTicketsTable, offersTable, applicationsTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router = Router();

router.get("/analytics/government", async (_req, res) => {
  try {
    const candidates = await db.select().from(candidatesTable);
    const vacancies = await db.select().from(vacanciesTable);
    const recognition = await db.select().from(recognitionCasesTable);
    const visa = await db.select().from(visaCasesTable);
    const welfare = await db.select().from(welfareTicketsTable);
    const offers = await db.select().from(offersTable);

    const districtMap: Record<string, number> = {};
    candidates.forEach(c => { if (c.district) districtMap[c.district] = (districtMap[c.district] ?? 0) + 1; });
    const districtBreakdown = Object.entries(districtMap).map(([district, count]) => ({ district, count })).sort((a, b) => b.count - a.count);

    const occupationMap: Record<string, { candidates: number; vacancies: number }> = {};
    candidates.forEach(c => { if (c.occupation) { occupationMap[c.occupation] = occupationMap[c.occupation] ?? { candidates: 0, vacancies: 0 }; occupationMap[c.occupation].candidates++; }});
    vacancies.forEach(v => { occupationMap[v.occupation] = occupationMap[v.occupation] ?? { candidates: 0, vacancies: 0 }; occupationMap[v.occupation].vacancies++; });
    const occupationDemand = Object.entries(occupationMap).map(([occupation, data]) => ({ occupation, ...data }));

    const langMap: Record<string, number> = {};
    candidates.forEach(c => { if (c.germanLanguageLevel) langMap[c.germanLanguageLevel] = (langMap[c.germanLanguageLevel] ?? 0) + 1; });
    const languageCompletion = Object.entries(langMap).map(([level, completed]) => ({ level, completed }));

    const recognitionOutcomes = {
      fullRecognition: recognition.filter(r => r.status === "full_recognition").length,
      partialRecognition: recognition.filter(r => r.status === "partial_recognition").length,
      pending: recognition.filter(r => !["full_recognition", "partial_recognition", "rejected"].includes(r.status)).length,
      rejected: recognition.filter(r => r.status === "rejected").length,
    };

    res.json({
      totalRegistrations: candidates.length,
      districtBreakdown,
      occupationDemand,
      languageCompletion,
      recognitionOutcomes,
      placements: offers.filter(o => o.status === "accepted").length,
      migratedCandidates: visa.filter(v => v.arrivalConfirmed).length,
      welfareCases: welfare.length,
      employerDemand: vacancies.filter(v => v.status === "active").length,
    });
  } catch (err) {
    logger.error({ err }, "getGovernmentAnalytics error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/facilitator", async (_req, res) => {
  try {
    const candidates = await db.select().from(candidatesTable);
    const recognition = await db.select().from(recognitionCasesTable);
    const visa = await db.select().from(visaCasesTable);
    const welfare = await db.select().from(welfareTicketsTable);
    const offers = await db.select().from(offersTable);
    const applications = await db.select().from(applicationsTable);

    const stageOrder = ["discovery", "registration", "eligibility", "language_training", "qualification_recognition", "document_vault", "employer_matching", "interview_offer", "visa_readiness", "post_arrival"];
    const stageLabels: Record<string, string> = {
      discovery: "Discovery", registration: "Registration", eligibility: "Eligibility",
      language_training: "Language Training", qualification_recognition: "Qualification Recognition",
      document_vault: "Document Vault", employer_matching: "Employer Matching",
      interview_offer: "Interview & Offer", visa_readiness: "Visa Readiness", post_arrival: "Post-Arrival",
    };
    const byStage = stageOrder.map(s => ({ stage: stageLabels[s] ?? s, count: candidates.filter(c => c.stage === s).length }));

    const acceptedOffers = offers.filter(o => o.status === "accepted").length;
    const totalOffers = offers.length;

    res.json({
      candidatesByStage: byStage,
      documentsPending: 12,
      recognitionPending: recognition.filter(r => ["documents_pending", "eligibility_check_pending", "authority_review"].includes(r.status)).length,
      visaPending: visa.filter(v => v.status === "checklist_in_progress" || v.status === "appointment_pending").length,
      interviewsThisWeek: applications.filter(a => a.status === "interview_scheduled").length,
      offerConversionRate: totalOffers > 0 ? Math.round((acceptedOffers / totalOffers) * 100) / 100 : 0,
      welfareAlerts: welfare.filter(w => w.priority === "urgent" || w.priority === "high").length,
    });
  } catch (err) {
    logger.error({ err }, "getFacilitatorAnalytics error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/pipeline", async (_req, res) => {
  try {
    const candidates = await db.select().from(candidatesTable);
    const stageOrder = ["discovery", "registration", "eligibility", "language_training", "qualification_recognition", "document_vault", "employer_matching", "interview_offer", "visa_readiness", "post_arrival"];
    const stageLabels: Record<string, string> = {
      discovery: "Discovery", registration: "Registration", eligibility: "Eligibility",
      language_training: "Language Training", qualification_recognition: "Qualification Recognition",
      document_vault: "Document Vault", employer_matching: "Employer Matching",
      interview_offer: "Interview & Offer", visa_readiness: "Visa Readiness", post_arrival: "Post-Arrival",
    };
    const byStage = stageOrder.map(s => ({ stage: s, label: stageLabels[s] ?? s, count: candidates.filter(c => c.stage === s).length }));
    const avgReadiness = candidates.length > 0 ? Math.round(candidates.reduce((s, c) => s + c.readinessScore, 0) / candidates.length) : 0;
    const germanyReadyCount = candidates.filter(c => c.readinessScore >= 82).length;
    res.json({ totalCandidates: candidates.length, byStage, avgReadiness, germanyReadyCount });
  } catch (err) {
    logger.error({ err }, "getPipelineStats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
