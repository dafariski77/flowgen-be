import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { usersTable } from "../schemas/user";
import { diagramHistoryTable } from "../schemas/diagram_history";
import { transactionsTable } from "../schemas/transactions";

export const DRIZZLE_CONNECTION = "DRIZZLE_CONNECTION";

export const drizzleProvider: Provider = {
  provide: DRIZZLE_CONNECTION,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const connectionString = configService.get<string>("DATABASE_URL");

    if (!connectionString) {
      throw new Error("DATABASE_URL is not defined");
    }

    const pool = new Pool({
      connectionString,
    });

    return drizzle(pool, {
      schema: {
        usersTable,
        diagramHistoryTable,
        transactionsTable,
      },
    });
  },
};
