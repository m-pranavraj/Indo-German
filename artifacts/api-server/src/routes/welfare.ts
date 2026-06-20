import { Router } from "express";
import { db } from "@workspace/db";
import { welfareTicketsTable, candidatesTable, usersTable } from "@workspace/db";
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

async function enrichTicket(t: typeof welfareTicketsTable.$inferSelect) {
  const [candidate] = await db.select({ userId: candidatesTable.userId }).from(candidatesTable).where(eq(candidatesTable.id, t.candidateId)).limit(1);
  const [user] = candidate ? await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, candidate.userId)).limit(1) : [null];
  return { ...t, candidateName: user?.name ?? null };
}

router.get("/welfare-tickets", async (_req, res) => {
  try {
    const rows = await db.select().from(welfareTicketsTable);
    res.json(await Promise.all(rows.map(enrichTicket)));
  } catch (err) {
    logger.error({ err }, "listWelfareTickets error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/welfare-tickets", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.userId, userId)).limit(1);
    if (!candidate) { res.status(403).json({ error: "Not a candidate" }); return; }
    const [ticket] = await db.insert(welfareTicketsTable).values({ ...req.body, candidateId: candidate.id }).returning();
    res.status(201).json(await enrichTicket(ticket));
  } catch (err) {
    logger.error({ err }, "createWelfareTicket error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/welfare-tickets/:id", async (req, res) => {
  try {
    const [t] = await db.select().from(welfareTicketsTable).where(eq(welfareTicketsTable.id, parseInt(req.params.id))).limit(1);
    if (!t) { res.status(404).json({ error: "Not found" }); return; }
    res.json(await enrichTicket(t));
  } catch (err) {
    logger.error({ err }, "getWelfareTicket error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/welfare-tickets/:id", async (req, res) => {
  try {
    const [result] = await db.update(welfareTicketsTable).set(req.body).where(eq(welfareTicketsTable.id, parseInt(req.params.id))).returning();
    if (!result) { res.status(404).json({ error: "Not found" }); return; }
    res.json(await enrichTicket(result));
  } catch (err) {
    logger.error({ err }, "updateWelfareTicket error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
