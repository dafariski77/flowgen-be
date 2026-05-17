import { Test, TestingModule } from "@nestjs/testing";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

// Mock uuid module before PaymentsService is loaded (it imports uuid transitively)
jest.mock("uuid", () => ({ v4: () => "mock-uuid" }));

describe("PaymentsController", () => {
  let controller: PaymentsController;
  let service: jest.Mocked<PaymentsService>;

  beforeEach(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        { provide: PaymentsService, useValue: { checkout: jest.fn(), handleWebhook: jest.fn() } },
      ],
    }).compile();

    controller = mod.get(PaymentsController);
    service = mod.get(PaymentsService);
  });

  it("should be defined", () => expect(controller).toBeDefined());

  describe("checkout", () => {
    it("should call service.checkout with userId", async () => {
      const expected = { orderId: "O1", paymentUrl: "https://pay.url", token: "t" };
      service.checkout.mockResolvedValue(expected);

      const result = await controller.checkout({ user: { sub: "u1" } });
      expect(service.checkout).toHaveBeenCalledWith("u1");
      expect(result).toEqual(expected);
    });
  });

  describe("handleWebhook", () => {
    it("should call service.handleWebhook with payload", async () => {
      const payload = { order_id: "O1", transaction_status: "settlement" };
      service.handleWebhook.mockResolvedValue({ message: "Webhook processed" });

      const result = await controller.handleWebhook(payload);
      expect(service.handleWebhook).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ message: "Webhook processed" });
    });
  });
});
