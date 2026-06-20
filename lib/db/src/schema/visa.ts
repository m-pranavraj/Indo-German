import { pgTable, serial, integer, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { candidatesTable } from "./candidates";

export const visaCaseStatusEnum = pgEnum("visa_case_status", [
  "not_started", "checklist_in_progress", "documents_ready",
  "appointment_pending", "submitted", "decision_pending", "approved", "rejected",
]);

export const visaCasesTable = pgTable("visa_cases", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidatesTable.id).notNull(),
  pathwayType: text("pathway_type"),
  status: visaCaseStatusEnum("status").default("not_started").notNull(),
  travelDate: text("travel_date"),
  arrivalConfirmed: boolean("arrival_confirmed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const visaChecklistItemsTable = pgTable("visa_checklist_items", {
  id: serial("id").primaryKey(),
  visaCaseId: integer("visa_case_id").references(() => visaCasesTable.id).notNull(),
  item: text("item").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  required: boolean("required").default(true).notNull(),
});

export const insertVisaCaseSchema = createInsertSchema(visaCasesTable).omit({ id: true, createdAt: true });
export const insertVisaChecklistItemSchema = createInsertSchema(visaChecklistItemsTable).omit({ id: true });
export type InsertVisaCase = z.infer<typeof insertVisaCaseSchema>;
export type InsertVisaChecklistItem = z.infer<typeof insertVisaChecklistItemSchema>;
export type VisaCase = typeof visaCasesTable.$inferSelect;
export type VisaChecklistItem = typeof visaChecklistItemsTable.$inferSelect;
