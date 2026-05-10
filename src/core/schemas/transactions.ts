import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const transactionsTable = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: varchar("order_id", { length: 255 }).notNull().unique(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  amount: integer("amount").notNull(),
  creditsAdded: integer("credits_added").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, success, failed
  paymentUrl: varchar("payment_url", { length: 255 }),
  midtransResponse: jsonb("midtrans_response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
