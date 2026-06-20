import { pgTable, serial, integer, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const candidateStageEnum = pgEnum("candidate_stage", [
  "discovery", "registration", "eligibility", "language_training",
  "qualification_recognition", "document_vault", "employer_matching",
  "interview_offer", "visa_readiness", "post_arrival",
]);

export const candidatesTable = pgTable("candidates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  district: text("district"),
  state: text("state"),
  occupation: text("occupation"),
  educationLevel: text("education_level"),
  experienceYears: integer("experience_years"),
  germanLanguageLevel: text("german_language_level"),
  passportAvailable: boolean("passport_available").default(false).notNull(),
  preferredGermanCity: text("preferred_german_city"),
  stage: candidateStageEnum("stage").default("registration").notNull(),
  readinessScore: integer("readiness_score").default(0).notNull(),
  profileComplete: boolean("profile_complete").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCandidateSchema = createInsertSchema(candidatesTable).omit({ id: true, createdAt: true });
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidatesTable.$inferSelect;
