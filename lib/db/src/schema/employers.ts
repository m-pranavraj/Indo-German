import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const verificationStatusEnum = pgEnum("verification_status", ["pending", "verified", "rejected"]);

export const employersTable = pgTable("employers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  companyName: text("company_name").notNull(),
  country: text("country").default("Germany").notNull(),
  city: text("city"),
  industry: text("industry"),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  verificationStatus: verificationStatusEnum("verification_status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmployerSchema = createInsertSchema(employersTable).omit({ id: true, createdAt: true });
export type InsertEmployer = z.infer<typeof insertEmployerSchema>;
export type Employer = typeof employersTable.$inferSelect;
