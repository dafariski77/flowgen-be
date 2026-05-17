import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const showcaseCategoryTable = pgTable("showcase_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});