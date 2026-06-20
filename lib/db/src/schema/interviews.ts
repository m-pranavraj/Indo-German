import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { applicationsTable } from "./applications";
import { candidatesTable } from "./candidates";
import { employersTable } from "./employers";

export const interviewStatusEnum = pgEnum("interview_status", ["scheduled", "completed", "cancelled", "no_show"]);

export const interviewsTable = pgTable("interviews", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applicationsTable.id).notNull(),
  candidateId: integer("candidate_id").references(() => candidatesTable.id).notNull(),
  employerId: integer("employer_id").references(() => employersTable.id).notNull(),
  scheduledAt: text("scheduled_at").notNull(),
  meetingLink: text("meeting_link"),
  status: interviewStatusEnum("status").default("scheduled").notNull(),
  feedback: text("feedback"),
  outcome: text("outcome"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInterviewSchema = createInsertSchema(interviewsTable).omit({ id: true, createdAt: true });
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type Interview = typeof interviewsTable.$inferSelect;
