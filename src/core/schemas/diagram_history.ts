import { pgTable, varchar, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const diagramHistoryTable = pgTable("diagram_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  diagramType: varchar("diagram_type", { length: 100 }).notNull(),
  mermaidCode: text("mermaid_code").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
