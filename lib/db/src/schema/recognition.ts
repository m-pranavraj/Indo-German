import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { candidatesTable } from "./candidates";

export const regulatedStatusEnum = pgEnum("regulated_status", ["regulated", "non_regulated", "unknown"]);
export const recognitionStatusEnum = pgEnum("recognition_status", [
  "not_required", "eligibility_check_pending", "documents_pending",
  "application_ready", "submitted", "authority_review",
  "partial_recognition", "full_recognition", "rejected", "bridge_course_required",
]);

export const recognitionCasesTable = pgTable("recognition_cases", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidatesTable.id).notNull(),
  indianQualification: text("indian_qualification").notNull(),
  germanProfession: text("german_profession").notNull(),
  regulatedStatus: regulatedStatusEnum("regulated_status").default("unknown").notNull(),
  recognitionAuthority: text("recognition_authority"),
  status: recognitionStatusEnum("status").default("eligibility_check_pending").notNull(),
  documentsRequired: text("documents_required").array(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRecognitionCaseSchema = createInsertSchema(recognitionCasesTable).omit({ id: true, createdAt: true });
export type InsertRecognitionCase = z.infer<typeof insertRecognitionCaseSchema>;
export type RecognitionCase = typeof recognitionCasesTable.$inferSelect;
