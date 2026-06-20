import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { candidatesTable } from "./candidates";

export const documentTypeEnum = pgEnum("document_type", [
  "passport", "aadhaar", "education_certificate", "marksheet",
  "iti_diploma", "experience_letter", "resume", "language_certificate",
  "police_clearance", "medical_certificate", "offer_letter",
  "recognition_document", "visa_document", "insurance",
]);

export const documentVerificationEnum = pgEnum("document_verification_status", [
  "pending", "under_review", "verified", "rejected", "expired",
]);

export const documentsTable = pgTable("documents", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidatesTable.id).notNull(),
  type: documentTypeEnum("type").notNull(),
  name: text("name").notNull(),
  fileUrl: text("file_url"),
  verificationStatus: documentVerificationEnum("verification_status").default("pending").notNull(),
  expiryDate: text("expiry_date"),
  reviewerNotes: text("reviewer_notes"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const insertDocumentSchema = createInsertSchema(documentsTable).omit({ id: true, uploadedAt: true });
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documentsTable.$inferSelect;
