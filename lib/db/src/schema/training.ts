import { pgTable, serial, integer, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { candidatesTable } from "./candidates";

export const languageLevelEnum = pgEnum("language_level", ["A1", "A2", "B1", "B2", "C1"]);
export const courseModeEnum = pgEnum("course_mode", ["online", "offline", "hybrid"]);
export const batchStatusEnum = pgEnum("batch_status", ["upcoming", "active", "completed", "cancelled"]);
export const enrollmentStatusEnum = pgEnum("enrollment_status", ["enrolled", "attending", "passed", "failed", "dropped"]);

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => usersTable.id).notNull(),
  name: text("name").notNull(),
  languageLevel: languageLevelEnum("language_level").notNull(),
  durationWeeks: integer("duration_weeks"),
  feeAmount: integer("fee_amount"),
  mode: courseModeEnum("mode").notNull(),
  city: text("city"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const batchesTable = pgTable("batches", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => coursesTable.id).notNull(),
  trainerName: text("trainer_name"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  status: batchStatusEnum("status").default("upcoming").notNull(),
  capacity: integer("capacity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const enrollmentsTable = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidatesTable.id).notNull(),
  batchId: integer("batch_id").references(() => batchesTable.id).notNull(),
  status: enrollmentStatusEnum("status").default("enrolled").notNull(),
  attendancePercent: integer("attendance_percent"),
  assessmentScore: integer("assessment_score"),
  certificateIssued: boolean("certificate_issued").default(false).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({ id: true, createdAt: true });
export const insertBatchSchema = createInsertSchema(batchesTable).omit({ id: true, createdAt: true });
export const insertEnrollmentSchema = createInsertSchema(enrollmentsTable).omit({ id: true, enrolledAt: true });

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertBatch = z.infer<typeof insertBatchSchema>;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Course = typeof coursesTable.$inferSelect;
export type Batch = typeof batchesTable.$inferSelect;
export type Enrollment = typeof enrollmentsTable.$inferSelect;
