import { Router } from "express";
import { db } from "@workspace/db";
import { candidatesTable, usersTable, documentsTable, recognitionCasesTable, enrollmentsTable, batchesTable, coursesTable } from "@workspace/db";
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

// ─── Groq API helper ────────────────────────────────────────────────────────
async function callGroq(
  messages: { role: string; content: string }[],
  systemPrompt?: string,
  maxTokens = 3000
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");

  const allMessages = systemPrompt
    ? [{ role: "system", content: systemPrompt }, ...messages]
    : messages;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: allMessages,
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq ${response.status}: ${err.slice(0, 200)}`);
  }

  const data = await response.json() as any;
  return (data.choices[0].message.content as string) || "";
}

// ─── AI Chat ────────────────────────────────────────────────────────────────
router.post("/ai/chat", async (req, res) => {
  try {
    const { message, context, history } = req.body as {
      message: string;
      context?: { role?: string };
      history?: { role: string; content: string }[];
    };

    const systemPrompt = `You are an expert AI assistant for the Indo German Mobility Corridor Platform — helping Indian skilled workers migrate to Germany for employment.

Your core expertise:
- German visa types: EU Blue Card (§18b), Skilled Worker Visa (§18a), Recognition Visa (§17b), Job Seeker Visa (§20)
- Qualification recognition: ZAB Statement of Comparability, IHK FOSA, ANABIN database
- Language training: CEFR A1–B2, Goethe-Zertifikat, telc, TestDaF, Goethe-Institut locations in India
- German labor market: in-demand occupations (nursing, automotive, electrician, plumbing, caregiving, IT, hospitality)
- Salary ranges: Kfz-Mechatroniker €32–48K, Nurse €36–52K, Electrician €38–54K, Software Dev €55–80K
- Migration timeline: typically 12–24 months from profile to arrival
- German social system: Krankenversicherung, AHV/pension, Meldepflicht, IBAN setup
- Costs: ZAB ~€200, Visa application €75, Language course ₹18,000–₹55,000
- Support: integration courses, Integrationskurs, language support in Germany

User role: ${context?.role || "candidate"}

Always be helpful, accurate, and concise. Use bullet points for lists. Give realistic numbers and timelines. Always provide 2–3 actionable next steps.`;

    const messages = [
      ...(history || []).slice(-8).map((h: any) => ({ role: h.role === "ai" ? "assistant" : h.role, content: h.content })),
      { role: "user", content: message },
    ];

    const groqResponse = await callGroq(messages, systemPrompt, 800);

    const suggestions = [
      "What documents do I need for the visa?",
      "How long will the whole process take?",
      "What salary can I expect in Germany?",
      "Which German language level do I need?",
      "How does qualification recognition work?",
      "What are the costs involved?",
    ].sort(() => Math.random() - 0.5).slice(0, 3);

    return res.json({ response: groqResponse, suggestions, links: [] });
  } catch (err: any) {
    logger.error({ err }, "AI chat error");
    return res.json({
      response: "I'm having trouble connecting to the AI service right now. Here are quick answers:\n\n• **Visa**: EU Blue Card for graduates (€43,992+ salary), §18a for vocational workers\n• **Language**: B1 for most jobs, B2 for nursing/care\n• **Timeline**: Typically 14–20 months total from start to Germany\n• **Recognition**: Submit to ZAB or IHK FOSA — costs ~€200, takes 3–4 months\n\nPlease try again in a moment!",
      suggestions: ["What visa type do I need?", "Language requirements?", "How does recognition work?"],
    });
  }
});

// ─── AI Resume Translation → German Lebenslauf ──────────────────────────────
router.post("/ai/translate-resume", async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body as { resumeText: string; targetRole?: string };

    if (!resumeText || resumeText.trim().length < 30) {
      return res.status(400).json({ error: "Please provide resume text (minimum 30 characters)" });
    }

    const systemPrompt = `You are Germany's top resume specialist. Convert Indian/English resumes into perfect German Lebenslauf format.

Strict requirements:
1. Translate ALL content to formal written German (Sie-Form conventions for documentation)
2. Use German date format: MM.YYYY (not January 2020, but 01.2020)
3. Convert job titles to official German Berufsbezeichnungen (IHK/ZAB recognized)
4. Structure as: Persönliche Daten → Berufsprofil → Berufserfahrung → Ausbildung/Bildung → Kenntnisse & Fähigkeiten → Sprachkenntnisse → Zertifizierungen
5. Use CEFR levels for all languages: Deutsch: B1, Englisch: C1
6. Salary expectations section: use gross annual (€ brutto/Jahr)
7. End with "Ort, Datum" and "Unterschrift" line
8. Keep it professional and concise — targeting German ATS systems
9. Add missing IHK/ZAB-relevant keywords for the role${targetRole ? ` (${targetRole})` : ''}
10. Include "Führerschein" section if driving licence mentioned

Return ONLY the formatted German Lebenslauf text. No explanations. No markdown. Just the CV.`;

    const germanResume = await callGroq(
      [{ role: "user", content: `Convert this resume to German Lebenslauf:\n\n${resumeText}` }],
      systemPrompt,
      2000
    );

    return res.json({ germanResume, success: true });
  } catch (err: any) {
    logger.error({ err }, "Resume translation error");
    return res.status(500).json({ error: "Translation failed. Please try again." });
  }
});

// ─── AI Gap Analysis ────────────────────────────────────────────────────────
router.post("/ai/gap-analysis", async (req, res) => {
  try {
    const { resumeText, targetRole, currentLanguageLevel } = req.body as {
      resumeText: string;
      targetRole: string;
      currentLanguageLevel?: string;
    };

    if (!resumeText || !targetRole) {
      return res.status(400).json({ error: "Resume text and target role are required" });
    }

    const systemPrompt = `You are an expert career advisor for Indian professionals migrating to Germany. Perform a detailed gap analysis.

Respond ONLY with valid JSON — no markdown, no explanation, just the JSON object:
{
  "overallMatch": <0-100>,
  "matchLabel": "<label like 'Strong Match' or 'Needs Work'>",
  "sections": [
    {
      "category": "<category name>",
      "score": <0-100>,
      "status": "<strong|moderate|weak>",
      "gap": "<specific gap description>",
      "action": "<specific recommended action>"
    }
  ],
  "missingSkills": ["<skill1>", "<skill2>"],
  "strengths": ["<strength1>", "<strength2>"],
  "timelineWeeks": <weeks as integer>,
  "estimatedCostINR": <cost as integer>,
  "urgentActions": ["<action1>", "<action2>", "<action3>"],
  "languageRequirement": "<A1|A2|B1|B2|C1>",
  "recognitionBody": "<ZAB|IHK FOSA|Anabin|etc>"
}

Categories MUST include: Technical Skills, German Language, Qualification Recognition, Certifications & Compliance, Work Experience, Soft Skills & Culture
Status: "strong" = score >= 70, "moderate" = 40–69, "weak" = < 40`;

    const response = await callGroq(
      [{ role: "user", content: `Target role: ${targetRole}\nCurrent German level: ${currentLanguageLevel || "Unknown"}\n\nResume:\n${resumeText.slice(0, 3000)}\n\nProvide gap analysis JSON.` }],
      systemPrompt,
      1500
    );

    let analysisData: any;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      analysisData = JSON.parse(jsonMatch ? jsonMatch[0] : response);
    } catch {
      // Structured fallback
      analysisData = {
        overallMatch: 62,
        matchLabel: "Moderate Match — Pathway Active",
        sections: [
          { category: "Technical Skills", score: 72, status: "strong", gap: "Some German-specific certifications needed", action: "Research IHK/ZAB recognition for your qualifications" },
          { category: "German Language", score: 30, status: "weak", gap: "B1/B2 required; current level insufficient", action: "Enroll in intensive German course at Goethe-Institut immediately" },
          { category: "Qualification Recognition", score: 55, status: "moderate", gap: "ZAB recognition not yet obtained", action: "Submit documents to ZAB — allow 12 weeks processing" },
          { category: "Certifications & Compliance", score: 60, status: "moderate", gap: "German safety/compliance certs missing", action: "Identify required certifications for role and plan training" },
          { category: "Work Experience", score: 80, status: "strong", gap: "Strong background, format in German standards", action: "Translate resume to Lebenslauf (use our AI translator)" },
          { category: "Soft Skills & Culture", score: 65, status: "moderate", gap: "German workplace culture awareness", action: "Read about German work culture — punctuality, directness, documentation" },
        ],
        missingSkills: ["German language proficiency (B1/B2)", "German safety certifications", "EU standards knowledge", "German ATS resume format"],
        strengths: ["Technical expertise in field", "Relevant work experience", "Strong education background"],
        timelineWeeks: 28,
        estimatedCostINR: 58000,
        urgentActions: ["Start German A1 course this week", "Contact ZAB for recognition assessment", "Use our AI translator to create German Lebenslauf"],
        languageRequirement: "B1",
        recognitionBody: "ZAB / ANABIN",
      };
    }

    return res.json(analysisData);
  } catch (err: any) {
    logger.error({ err }, "Gap analysis error");
    return res.status(500).json({ error: "Analysis failed. Please try again." });
  }
});

// ─── AI Onboarding (profile → German resume + roadmap) ──────────────────────
router.post("/ai/onboard", async (req, res) => {
  try {
    const { profile } = req.body as {
      profile: {
        name: string; age: string; gender: string; education: string;
        occupation: string; experience: string; germanLevel: string;
        hasPassport: boolean; targetRole?: string;
      };
    };

    const systemPrompt = `You are an expert migration counselor for Indo-German workforce mobility. Generate a complete onboarding package.

Respond ONLY with valid JSON:
{
  "readinessScore": <0-100>,
  "readinessLabel": "<short label>",
  "germanResume": "<full German Lebenslauf text with all sections>",
  "roadmap": [
    { "phase": 1, "title": "<phase title>", "duration": "<duration>", "actions": ["<action>"], "cost": "<cost in ₹>" }
  ],
  "keyStrengths": ["<strength>"],
  "nextSteps": ["<step>"],
  "estimatedTimeline": "<e.g. 14–18 months>",
  "estimatedCost": "<e.g. ₹65,000–₹1,10,000>",
  "targetSalary": "<e.g. €38,000–€48,000/year>"
}

Include 4–5 roadmap phases. German resume must be full and realistic.`;

    const prompt = `Create onboarding package for:
Name: ${profile.name}
Age: ${profile.age}
Gender: ${profile.gender}
Education: ${profile.education}
Occupation: ${profile.occupation}
Experience: ${profile.experience} years
German Level: ${profile.germanLevel}
Has Passport: ${profile.hasPassport}
Target German Role: ${profile.targetRole || profile.occupation}`;

    const response = await callGroq([{ role: "user", content: prompt }], systemPrompt, 2500);

    let data: any;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      data = JSON.parse(jsonMatch ? jsonMatch[0] : response);
    } catch {
      const birthYear = new Date().getFullYear() - parseInt(profile.age || "25");
      data = {
        readinessScore: 68,
        readinessLabel: "Good — Pathway Active",
        germanResume: `LEBENSLAUF\n\nPersönliche Daten\nName: ${profile.name}\nGeburtsjahr: ${birthYear}\nNationalität: Indisch\n\nBerufsprofil\nErfahrener ${profile.occupation} mit ${profile.experience} Jahren Berufserfahrung. Sucht eine qualifizierte Tätigkeit in Deutschland.\n\nBerufserfahrung\n${profile.occupation}\n${new Date().getFullYear() - parseInt(profile.experience || "3")} – heute | Indien\n• Umfangreiche Erfahrung in der Branche\n• Ergebnisorientiertes Arbeiten und Teamarbeit\n\nAusbildung\n${profile.education}\n\nSprachkenntnisse\nDeutsch: ${profile.germanLevel}\nEnglisch: B2\nHindi: Muttersprache\n\nKenntnisse\n• Technische Fachkompetenz\n• Teamfähigkeit\n• Zuverlässigkeit\n\nOrt, Datum: ____________\nUnterschrift: ____________`,
        roadmap: [
          { phase: 1, title: "Language Training", duration: "4–6 months", actions: ["Enroll in A1/A2 at Goethe-Institut", "Practice daily with Duolingo + Tandem"], cost: "₹18,000–₹25,000" },
          { phase: 2, title: "Qualification Recognition (ZAB)", duration: "3–4 months", actions: ["Gather all certificates", "Submit to ZAB / IHK FOSA"], cost: "₹18,000 (~€200)" },
          { phase: 3, title: "Platform Registration & Employer Matching", duration: "2–3 months", actions: ["Complete Indo German profile", "Apply to matched vacancies", "Attend video interviews"], cost: "₹0" },
          { phase: 4, title: "Visa Application", duration: "2–3 months", actions: ["Book VFS appointment", "Submit Videx form + documents"], cost: "₹25,000–₹35,000" },
          { phase: 5, title: "Pre-departure & Arrival", duration: "2–4 weeks", actions: ["Pre-departure orientation", "Book flights", "Register Meldepflicht on arrival"], cost: "₹15,000–₹30,000" },
        ],
        keyStrengths: [`${profile.experience} years of professional experience`, `${profile.education} qualification`, "India–Germany eligible occupation"],
        nextSteps: ["Start German A1 course immediately", "Submit documents to ZAB", "Complete your platform profile"],
        estimatedTimeline: "14–20 months",
        estimatedCost: "₹76,000–₹1,08,000",
        targetSalary: "€32,000–€52,000/year",
      };
    }

    return res.json(data);
  } catch (err: any) {
    logger.error({ err }, "Onboarding AI error");
    return res.status(500).json({ error: "Generation failed. Please try again." });
  }
});

// ─── AI Roadmap (rule-based, always available) ──────────────────────────────
router.post("/ai/roadmap", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { candidateId } = req.body as { candidateId?: number };

    let candidate: any = null;
    if (userId) {
      const rows = await db.select().from(candidatesTable).where(eq(candidatesTable.userId, userId)).limit(1);
      if (rows[0]) candidate = rows[0];
    }
    if (!candidate && candidateId) {
      const rows = await db.select().from(candidatesTable).where(eq(candidatesTable.id, candidateId)).limit(1);
      if (rows[0]) candidate = rows[0];
    }

    const stage = candidate?.stage ?? "registration";
    const langLevel = candidate?.germanLanguageLevel ?? null;
    const hasPassport = candidate?.passportAvailable ?? false;
    const occupation = candidate?.occupation ?? "Skilled Worker";
    const educationLevel = candidate?.educationLevel ?? "Diploma";
    const experience = candidate?.experienceYears ?? 0;

    const langMap: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
    const currentLangScore = langMap[langLevel ?? ""] ?? 0;
    const isNursingRole = ["Nursing", "Nurse", "Aged Care", "Altenpflege"].some(o => occupation.includes(o));
    const targetLangScore = isNursingRole ? 4 : 3;
    const langGap = Math.max(0, targetLangScore - currentLangScore);

    const stageOrder = ["registration","eligibility","language_training","qualification_recognition","document_vault","employer_matching","interview_offer","visa_readiness","post_arrival"];
    const currentStageIdx = stageOrder.indexOf(stage);

    const phases: any[] = [];
    let totalWeeks = 0;
    let totalCostINR = 0;

    if (currentStageIdx <= 1) {
      phases.push({
        phase: 1, title: "Profile & Eligibility Assessment", duration: "2–3 weeks", weeks: 2, costINR: 0,
        actions: ["Complete digital profile on platform", "Upload Aadhaar + education certificates", "Complete eligibility quiz", ...(!hasPassport ? ["Apply for passport (6–8 weeks)"] : ["Verify passport validity (min 2 years remaining)"])],
        outcome: "Eligibility confirmed", status: currentStageIdx > 1 ? "completed" : "active",
      });
      totalWeeks += 2;
    }

    const langWeeks = langGap === 0 ? 0 : langGap === 1 ? 14 : langGap === 2 ? 26 : 40;
    const langCost = langWeeks > 0 ? langGap === 1 ? 20000 : langGap === 2 ? 36000 : 52000 : 0;
    if (langWeeks > 0 || currentStageIdx === 3) {
      phases.push({
        phase: phases.length + 1,
        title: `German Language Training (→ ${isNursingRole ? "B2" : "B1"})`,
        duration: langWeeks > 0 ? `${langWeeks} weeks` : "Completed",
        weeks: langWeeks, costINR: langCost,
        actions: ["Enroll at Goethe-Institut or Max Mueller Bhavan", "30 min/day practice with Tandem app", `Complete ${isNursingRole ? "B2" : "B1"} certification exam`],
        outcome: `${isNursingRole ? "B2" : "B1"} certificate obtained`,
        status: currentStageIdx >= 3 ? (currentStageIdx === 3 ? "active" : "completed") : "pending",
      });
      totalWeeks += langWeeks;
      totalCostINR += langCost;
    }

    phases.push({
      phase: phases.length + 1, title: "Qualification Recognition (ZAB / IHK FOSA)",
      duration: "12–16 weeks", weeks: 14, costINR: 18000,
      actions: ["Submit original certificates to ZAB", "Pay recognition fee (~€200)", "Receive Statement of Comparability"],
      outcome: "Recognition letter from ZAB",
      status: currentStageIdx >= 4 ? (currentStageIdx === 4 ? "active" : "completed") : "pending",
    });
    totalWeeks += 14; totalCostINR += 18000;

    phases.push({
      phase: phases.length + 1, title: "Employer Matching & Interview",
      duration: "8–12 weeks", weeks: 10, costINR: 0,
      actions: ["Create Indo German platform profile", "Apply to matched German vacancies", "Attend video interviews with employers", "Negotiate employment contract"],
      outcome: "Signed employment contract + job offer letter",
      status: currentStageIdx >= 5 ? (currentStageIdx === 5 ? "active" : "completed") : "pending",
    });
    totalWeeks += 10;

    phases.push({
      phase: phases.length + 1, title: "Visa Application & Pre-departure",
      duration: "8–12 weeks", weeks: 10, costINR: 30000,
      actions: ["Book VFS Global appointment", "Complete Videx online form", "Submit visa application + documents", "Attend pre-departure orientation"],
      outcome: "Visa stamped — ready to fly!",
      status: currentStageIdx >= 7 ? (currentStageIdx === 7 ? "active" : "completed") : "pending",
    });
    totalWeeks += 10; totalCostINR += 30000;

    const readiness = candidate?.readinessScore ?? Math.min(95, 20 + currentStageIdx * 11);
    const salaryRange = isNursingRole ? "€36,000–€52,000" :
      occupation.toLowerCase().includes("software") || occupation.toLowerCase().includes("it") ? "€55,000–€80,000" :
      occupation.toLowerCase().includes("automotive") || occupation.toLowerCase().includes("mechanic") ? "€32,000–€48,000" :
      "€28,000–€44,000";

    return res.json({
      candidate: candidate ? { occupation, educationLevel, experience, germanLanguageLevel: langLevel, stage, readinessScore: readiness } : null,
      phases,
      summary: { totalWeeks, totalMonths: Math.ceil(totalWeeks / 4), totalCostINR, totalCostEUR: Math.round(totalCostINR / 89), targetSalaryEUR: salaryRange, currentReadiness: readiness, isGermanyReady: readiness >= 80 },
    });
  } catch (err: any) {
    logger.error({ err }, "Roadmap error");
    return res.status(500).json({ error: String(err.message) });
  }
});

export default router;
