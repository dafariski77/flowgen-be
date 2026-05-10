import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { MidtransService } from "./midtrans.service";
import { DRIZZLE_CONNECTION } from "../../core/database/drizzle";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { usersTable } from "../../core/schemas/user";
import { transactionsTable } from "../../core/schemas/transactions";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class PaymentsService {
  // Configured pricing for top-up
  private readonly PRO_PRICE = 50000;
  private readonly PRO_CREDITS = 200;

  constructor(
    private readonly midtransService: MidtransService,
    @Inject(DRIZZLE_CONNECTION)
    private readonly db: NodePgDatabase<{
      usersTable: typeof usersTable;
      transactionsTable: typeof transactionsTable;
    }>,
  ) {}

  async checkout(userId: string) {
    const userResult = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    const user = userResult[0];
    if (!user) throw new NotFoundException("User not found");

    const orderId = `ORDER-${uuidv4()}`;

    // Create transaction record
    await this.db.insert(transactionsTable).values({
      orderId,
      userId,
      amount: this.PRO_PRICE,
      creditsAdded: this.PRO_CREDITS,
      status: "pending",
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: this.PRO_PRICE,
      },
      customer_details: {
        first_name: user.name,
        email: user.email,
      },
      item_details: [
        {
          id: "pro-tier-topup",
          price: this.PRO_PRICE,
          quantity: 1,
          name: "FlowGen AI Pro Tier - 200 Credits",
        },
      ],
    };

    const transaction =
      await this.midtransService.createSnapTransaction(parameter);

    // Update transaction with payment URL
    await this.db
      .update(transactionsTable)
      .set({ paymentUrl: transaction.redirect_url })
      .where(eq(transactionsTable.orderId, orderId));

    return {
      orderId,
      paymentUrl: transaction.redirect_url,
      token: transaction.token,
    };
  }

  async handleWebhook(payload: any) {
    const { order_id, transaction_status, fraud_status } = payload;

    const transactionResult = await this.db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.orderId, order_id))
      .limit(1);

    const transaction = transactionResult[0];
    if (!transaction) throw new NotFoundException("Transaction not found");

    let newStatus = transaction.status;

    if (transaction_status == "capture" || transaction_status == "settlement") {
      if (fraud_status == "challenge") {
        // TODO set transaction status on your database to 'challenge'
        newStatus = "pending"; // or 'challenge'
      } else if (fraud_status == "accept" || !fraud_status) {
        // TODO set transaction status on your database to 'success'
        newStatus = "success";
      }
    } else if (
      transaction_status == "cancel" ||
      transaction_status == "deny" ||
      transaction_status == "expire"
    ) {
      newStatus = "failed";
    } else if (transaction_status == "pending") {
      newStatus = "pending";
    }

    // Update transaction status
    await this.db
      .update(transactionsTable)
      .set({
        status: newStatus,
        midtransResponse: payload,
        updatedAt: new Date(),
      })
      .where(eq(transactionsTable.orderId, order_id));

    // If success, update user credits
    if (newStatus === "success" && transaction.status !== "success") {
      const userResult = await this.db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, transaction.userId))
        .limit(1);

      const user = userResult[0];
      if (user) {
        await this.db
          .update(usersTable)
          .set({
            credits: user.credits + transaction.creditsAdded,
            tier: "pro",
          })
          .where(eq(usersTable.id, user.id));
      }
    }

    return { message: "Webhook processed" };
  }
}
