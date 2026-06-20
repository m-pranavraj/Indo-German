import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { applicationsTable } from "./applications";
import { candidatesTable } from "./candidates";
import { employersTable } from "./employers";

export const offerStatusEnum = pgEnum("offer_status", ["issued", "accepted", "rejected", "expired", "withdrawn"]);

export const offersTable = pgTable("offers", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applicationsTable.id).notNull(),
  candidateId: integer("candidate_id").references(() => candidatesTable.id).notNull(),
  employerId: integer("employer_id").references(() => employersTable.id).notNull(),
  salaryOffered: integer("salary_offered"),
  joiningDate: text("joining_date"),
  status: offerStatusEnum("status").default("issued").notNull(),
  offerLetterUrl: text("offer_letter_url"),
  expiresAt: text("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOfferSchema = createInsertSchema(offersTable).omit({ id: true, createdAt: true });
export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type Offer = typeof offersTable.$inferSelect;
