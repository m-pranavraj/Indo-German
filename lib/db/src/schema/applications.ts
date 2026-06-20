import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { candidatesTable } from "./candidates";
import { vacanciesTable } from "./vacancies";

export const applicationStatusEnum = pgEnum("application_status", [
  "applied", "shortlisted", "interview_scheduled", "interview_done",
  "offer_issued", "offer_accepted", "offer_rejected", "withdrawn",
]);

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidatesTable.id).notNull(),
  vacancyId: integer("vacancy_id").references(() => vacanciesTable.id).notNull(),
  coverNote: text("cover_note"),
  status: applicationStatusEnum("status").default("applied").notNull(),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({ id: true, createdAt: true, appliedAt: true });
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
