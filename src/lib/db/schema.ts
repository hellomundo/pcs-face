import { relations, sql } from "drizzle-orm";
import { boolean } from "drizzle-orm/mysql-core";
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const students = sqliteTable('students', {
    id: text("id").primaryKey(),
    name: text("name"),
    face: text("face", {mode: "json"}),
    createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`)
});

export const studentsRelations = relations(students, ({ many }) => ({
    attendances: many(attendances),
  }));

export const attendances = sqliteTable('attendances', {
    id: text("id").primaryKey(),
    studentId: text("studentId").notNull().references(() => students.id),
    createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`)
});

export const attendancessRelations = relations(attendances, ({ one }) => ({
    student: one(students, {
      fields: [attendances.studentId],
      references: [students.id],
    }),
  }));