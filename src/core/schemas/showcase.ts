import {
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { showcaseCategoryTable } from "./showcase_category";
import { usersTable } from "./user";
import { diagramHistoryTable } from "./diagram_history";

export const showcaseTable = pgTable("showcases", {
  id: uuid("id").primaryKey().defaultRandom(),

  // --- Core Content ---
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }).notNull(),

  // --- Diagram Source ---
  diagramHistoryId: uuid("diagram_history_id")
    .references(() => diagramHistoryTable.id)
    .notNull(),

  // --- Category Relation ---
  categoryId: uuid("category_id")
    .references(() => showcaseCategoryTable.id)
    .notNull(),

  // --- Technical Blueprint ---
  prompt: text("prompt").notNull(), // AI prompt used to generate the diagram
  engineVersion: varchar("engine_version", { length: 50 }), // e.g. "PROMPT_ENGINE_v4.2"
  logicFlowDescription: text("logic_flow_description"), // Logic flow explanation
  securityLayerDescription: text("security_layer_description"), // Security layer explanation

  // --- System Parameters (Metadata Sidebar) ---
  diagramType: varchar("diagram_type", { length: 100 }).notNull(), // e.g. "Architecture", "Flowchart", "Sequence"
  nodeCount: integer("node_count").default(0).notNull(), // Number of nodes in the diagram
  complexityLevel: integer("complexity_level").default(1).notNull(), // 1-4 scale
  estimatedCredits: integer("estimated_credits").default(1).notNull(), // Credits needed to remix
  buildVersion: varchar("build_version", { length: 50 }), // e.g. "STABLE_BUILD_V2"

  // --- Author ---
  createdBy: uuid("created_by").references(() => usersTable.id), // null = "FlowGen Core" (system generated)

  // --- Timestamps ---
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
