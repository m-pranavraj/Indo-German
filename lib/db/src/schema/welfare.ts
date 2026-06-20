import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { candidatesTable } from "./candidates";

export const welfareCategoryEnum = pgEnum("welfare_category", [
  "accommodation", "exploitation", "fraud", "health", "legal", "general", "employer_grievance",
]);
export const welfarePriorityEnum = pgEnum("welfare_priority", ["low", "medium", "high", "urgent"]);
export const welfareStatusEnum = pgEnum("welfare_status", ["open", "in_progress", "resolved", "closed"]);

export const welfareTicketsTable = pgTable("welfare_tickets", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidatesTable.id).notNull(),
  category: welfareCategoryEnum("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: welfarePriorityEnum("priority").default("medium").notNull(),
  status: welfareStatusEnum("status").default("open").notNull(),
  assignedTo: text("assigned_to"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWelfareTicketSchema = createInsertSchema(welfareTicketsTable).omit({ id: true, createdAt: true });
export type InsertWelfareTicket = z.infer<typeof insertWelfareTicketSchema>;
export type WelfareTicket = typeof welfareTicketsTable.$inferSelect;
