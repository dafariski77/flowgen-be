import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { DRIZZLE_CONNECTION } from "../../core/database/drizzle";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { usersTable } from "../../core/schemas/user";
import { diagramHistoryTable } from "../../core/schemas/diagram_history";
import { eq, desc } from "drizzle-orm";

@Injectable()
export class DiagramsService {
  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly db: NodePgDatabase<{
      usersTable: typeof usersTable;
      diagramHistoryTable: typeof diagramHistoryTable;
    }>,
  ) {}

  async generateDiagram(userId: string, prompt: string) {
    const userResult = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    const user = userResult[0];

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    if (user.credits <= 0) {
      throw new HttpException(
        "Payment Required: Saldo kredit Anda habis. Silakan top up.",
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    // Forward request to ElysiaJS (AI Microservice)
    // For now, we will simulate this or use a dummy response
    // if ElysiaJS is not running yet.
    const mermaidCode = "graph TD; A-->B;"; // Dummy mermaid code from ElysiaJS
    const title = prompt.split(" ").slice(0, 3).join(" ") || "New Diagram";

    // Deduct credits
    await this.db
      .update(usersTable)
      .set({ credits: user.credits - 1 })
      .where(eq(usersTable.id, userId));

    // Save history
    const historyResult = await this.db
      .insert(diagramHistoryTable)
      .values({
        userId,
        title,
        diagramType: "flowchart", // this should ideally come from AI
        mermaidCode,
      })
      .returning();

    return historyResult[0];
  }

  async getHistory(userId: string) {
    return this.db
      .select()
      .from(diagramHistoryTable)
      .where(eq(diagramHistoryTable.userId, userId))
      .orderBy(desc(diagramHistoryTable.createdAt));
  }
}
