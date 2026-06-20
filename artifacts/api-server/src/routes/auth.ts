import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, candidatesTable, employersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

function makeToken(userId: number): string {
  return Buffer.from(`${userId}:${Date.now()}`).toString("base64");
}

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      res.status(400).json({ error: "email and password required" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const hashed = hashPassword(password);
    if (user.passwordHash !== hashed) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const { passwordHash: _, ...safeUser } = user;
    res.json({ user: safeUser, token: makeToken(user.id) });
  } catch (err) {
    logger.error({ err }, "login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/register", async (req, res) => {
  try {
    const { email, password, name, role, phone, organization } = req.body as {
      email: string; password: string; name: string;
      role: "candidate" | "employer" | "trainer" | "facilitator" | "government" | "admin";
      phone?: string; organization?: string;
    };
    if (!email || !password || !name || !role) {
      res.status(400).json({ error: "email, password, name, role required" });
      return;
    }
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (existing.length > 0) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }
    const [user] = await db.insert(usersTable).values({
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      name,
      role,
      phone: phone ?? null,
      organization: organization ?? null,
    }).returning();

    if (role === "candidate") {
      await db.insert(candidatesTable).values({ userId: user.id, passportAvailable: false, stage: "registration", readinessScore: 10, profileComplete: false });
    } else if (role === "employer") {
      await db.insert(employersTable).values({
        userId: user.id,
        companyName: organization ?? "My Company",
        country: "Germany",
        contactName: name,
        contactEmail: email.toLowerCase(),
      });
    }

    const { passwordHash: _, ...safeUser } = user;
    res.status(201).json({ user: safeUser, token: makeToken(user.id) });
  } catch (err) {
    logger.error({ err }, "register error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/auth/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) { res.status(401).json({ error: "No auth" }); return; }
    const token = auth.replace("Bearer ", "");
    const decoded = Buffer.from(token, "base64").toString();
    const userId = parseInt(decoded.split(":")[0]);
    if (isNaN(userId)) { res.status(401).json({ error: "Invalid token" }); return; }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    const { passwordHash: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    logger.error({ err }, "getMe error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/logout", (_req, res) => {
  res.json({ success: true });
});

export default router;
