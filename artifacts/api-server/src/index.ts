import app from "./app";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// ─── Demo seed ──────────────────────────────────────────────────────────────
// Same simple hash as auth.ts — keeps the two in sync without importing each other
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

const DEMO_HASH = simpleHash("Demo@1234");

const DEMO_USERS = [
  { email: "arjun.sharma@gmail.com",  name: "Arjun Sharma",         role: "candidate",   phone: "+91-9876543210", org: null },
  { email: "priya.nair@gmail.com",    name: "Priya Nair",           role: "candidate",   phone: "+91-9876543211", org: null },
  { email: "ravi.kumar@gmail.com",    name: "Ravi Kumar",           role: "candidate",   phone: "+91-9876543212", org: null },
  { email: "hr@bosch-germany.de",     name: "Robert Bosch GmbH HR", role: "employer",    phone: "+49-711-4000",   org: "Robert Bosch GmbH" },
  { email: "jobs@carehome-berlin.de", name: "BerlinCare Pflege HR", role: "employer",    phone: "+49-30-1234567", org: "BerlinCare Altenpflege" },
  { email: "admin@goethe-pune.in",    name: "Goethe-Institut Pune", role: "trainer",     phone: "+91-2026543210", org: "Goethe-Institut Pune" },
  { email: "ops@indiagermanyjobs.in", name: "Indo-German Careers",  role: "facilitator", phone: "+91-9988776655", org: "Indo-German Careers" },
  { email: "official@msde.gov.in",    name: "MSDE Official",        role: "government",  phone: "+91-1123456789", org: "MSDE" },
  { email: "admin@mobicorridor.in",   name: "Platform Admin",       role: "admin",       phone: null,             org: "Indo German Mobility" },
] as const;

const DEMO_CANDIDATES = [
  { email: "arjun.sharma@gmail.com", stage: "employer_matching", score: 78, passport: true,  occ: "Automotive Mechanic", lang: "B1", state: "Maharashtra", district: "Pune" },
  { email: "priya.nair@gmail.com",   stage: "visa_readiness",    score: 91, passport: true,  occ: "Nurse",               lang: "B2", state: "Kerala",       district: "Kochi" },
  { email: "ravi.kumar@gmail.com",   stage: "language_training", score: 52, passport: false, occ: "Electrician",         lang: "A2", state: "Tamil Nadu",    district: "Chennai" },
] as const;

const DEMO_EMPLOYERS = [
  { email: "hr@bosch-germany.de",     company: "Robert Bosch GmbH",     industry: "Automotive", city: "Stuttgart" },
  { email: "jobs@carehome-berlin.de", company: "BerlinCare Altenpflege", industry: "Healthcare", city: "Berlin" },
] as const;

async function seedDemoData() {
  try {
    const existing = await pool.query("SELECT COUNT(*) as cnt FROM users");
    if (parseInt(existing.rows[0].cnt) > 0) {
      logger.info("Demo seed: users already present, skipping");
      return;
    }

    logger.info("Demo seed: seeding demo users…");
    const ids: Record<string, number> = {};

    for (const u of DEMO_USERS) {
      const r = await pool.query(
        "INSERT INTO users (email, password_hash, name, role, phone, organization) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name RETURNING id",
        [u.email, DEMO_HASH, u.name, u.role, u.phone, u.org]
      );
      ids[u.email] = r.rows[0].id;
    }

    for (const c of DEMO_CANDIDATES) {
      const uid = ids[c.email];
      if (!uid) continue;
      await pool.query(
        "INSERT INTO candidates (user_id, passport_available, stage, readiness_score, profile_complete, occupation, german_language_level, state, district) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING",
        [uid, c.passport, c.stage, c.score, true, c.occ, c.lang, c.state, c.district]
      );
    }

    for (const e of DEMO_EMPLOYERS) {
      const uid = ids[e.email];
      if (!uid) continue;
      await pool.query(
        "INSERT INTO employers (user_id, company_name, industry, city, country, contact_name, contact_email) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING",
        [uid, e.company, e.industry, e.city, "Germany", e.company + " HR", e.email]
      );
    }

    logger.info("Demo seed: complete — 9 users, 3 candidate profiles, 2 employer profiles");
  } catch (err) {
    logger.warn({ err }, "Demo seed failed (non-fatal) — app will still start");
  }
}

// ─── Start ───────────────────────────────────────────────────────────────────
seedDemoData().then(() => {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
});
