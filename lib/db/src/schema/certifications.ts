import { pgTable, serial, integer, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { candidatesTable } from "./candidates";

export const certificationTypeEnum = pgEnum("certification_type", [
  "language", "trade", "safety", "first_aid", "professional", "academic", "german_recognition", "other",
]);

export const certificationStatusEnum = pgEnum("certification_status", [
  "pending_exam", "obtained", "expired", "uploaded", "verified", "rejected",
]);

export const certificationsTable = pgTable("certifications", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidatesTable.id).notNull(),
  name: text("name").notNull(),
  issuingBody: text("issuing_body").notNull(),
  type: certificationTypeEnum("type").notNull(),
  level: text("level"),
  issueDate: text("issue_date"),
  expiryDate: text("expiry_date"),
  certificateNumber: text("certificate_number"),
  fileUrl: text("file_url"),
  status: certificationStatusEnum("status").default("uploaded").notNull(),
  verifiedAt: timestamp("verified_at"),
  notes: text("notes"),
  germanEquivalent: text("german_equivalent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCertificationSchema = createInsertSchema(certificationsTable).omit({ id: true, createdAt: true });
export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type Certification = typeof certificationsTable.$inferSelect;
