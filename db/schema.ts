import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/** Official pages that Atlas monitors. A source is never a student-facing claim by itself. */
export const schoolSources = sqliteTable("school_sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  schoolSlug: text("school_slug").notNull(),
  schoolName: text("school_name").notNull(),
  label: text("label").notNull(),
  url: text("url").notNull().unique(),
  kind: text("kind").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  lastFingerprint: text("last_fingerprint"),
  lastCheckedAt: text("last_checked_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

/**
 * A human-reviewable piece of school intelligence. Only `verified` records are
 * returned to the student application.
 */
export const intelligenceItems = sqliteTable("intelligence_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  schoolSlug: text("school_slug").notNull(),
  schoolName: text("school_name").notNull(),
  schoolCode: text("school_code").notNull(),
  schoolAccent: text("school_accent").notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  fact: text("fact").notNull(),
  impact: text("impact").notNull(),
  action: text("action").notNull(),
  level: text("level").notNull(),
  sourceUrl: text("source_url").notNull(),
  sourceLabel: text("source_label").notNull(),
  sourcePublishedAt: text("source_published_at"),
  observedAt: text("observed_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  reviewStatus: text("review_status").notNull().default("pending_review"),
  reviewedBy: text("reviewed_by"),
  reviewedAt: text("reviewed_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
