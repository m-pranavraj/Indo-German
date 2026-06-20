import { pgTable, serial, integer, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { employersTable } from "./employers";

export const vacancyStatusEnum = pgEnum("vacancy_status", ["active", "filled", "paused", "closed"]);

export const vacanciesTable = pgTable("vacancies", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").references(() => employersTable.id).notNull(),
  title: text("title").notNull(),
  occupation: text("occupation").notNull(),
  location: text("location").notNull(),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  languageLevel: text("language_level"),
  shiftType: text("shift_type"),
  experienceYears: integer("experience_years"),
  recognitionRequired: boolean("recognition_required").default(false).notNull(),
  visaSupport: boolean("visa_support").default(false).notNull(),
  accommodationSupport: boolean("accommodation_support").default(false).notNull(),
  joiningDate: text("joining_date"),
  status: vacancyStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVacancySchema = createInsertSchema(vacanciesTable).omit({ id: true, createdAt: true });
export type InsertVacancy = z.infer<typeof insertVacancySchema>;
export type Vacancy = typeof vacanciesTable.$inferSelect;
