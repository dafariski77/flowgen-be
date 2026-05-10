import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  provider: varchar("provider", { length: 255 }).default("local"),
  providerId: varchar("provider_id", { length: 255 }),
  tier: varchar("tier", { length: 50 }).default("free").notNull(),
  credits: integer("credits").default(10).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
