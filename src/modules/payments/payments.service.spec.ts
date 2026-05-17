import { Test, TestingModule } from "@nestjs/testing";
import { PaymentsService } from "./payments.service";
import { MidtransService } from "./midtrans.service";
import { DRIZZLE_CONNECTION } from "../../core/database/drizzle";
import { NotFoundException } from "@nestjs/common";

jest.mock("uuid", () => ({ v4: () => "mock-uuid" }));

describe("PaymentsService", () => {
  let service: PaymentsService;
  let midtrans: jest.Mocked<MidtransService>;
  let db: any;

  beforeEach(async () => {
    db = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    };

    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: MidtransService, useValue: { createSnapTransaction: jest.fn() } },
        { provide: DRIZZLE_CONNECTION, useValue: db },
      ],
    }).compile();

    service = mod.get(PaymentsService);
    midtrans = mod.get(MidtransService);
  });

  it("should be defined", () => expect(service).toBeDefined());

  describe("checkout", () => {
    it("should return payment URL on success", async () => {
      db.limit.mockResolvedValue([{ id: "u1", name: "J", email: "j@e.com", credits: 10 }]);
      midtrans.createSnapTransaction.mockResolvedValue({ redirect_url: "https://pay.url", token: "t" });

      const r = await service.checkout("u1");
      expect(r.paymentUrl).toBe("https://pay.url");
    });

    it("should throw if user not found", async () => {
      db.limit.mockResolvedValue([]);
      await expect(service.checkout("x")).rejects.toThrow(NotFoundException);
    });
  });

  describe("handleWebhook", () => {
    it("should process settlement", async () => {
      db.limit
        .mockResolvedValueOnce([{ orderId: "O1", userId: "u1", status: "pending", creditsAdded: 200 }])
        .mockResolvedValueOnce([{ id: "u1", credits: 10 }]);

      const r = await service.handleWebhook({ order_id: "O1", transaction_status: "settlement", fraud_status: "accept" });
      expect(r).toEqual({ message: "Webhook processed" });
    });

    it("should throw if transaction not found", async () => {
      db.limit.mockResolvedValue([]);
      await expect(service.handleWebhook({ order_id: "X", transaction_status: "settlement" })).rejects.toThrow(NotFoundException);
    });
  });
});
