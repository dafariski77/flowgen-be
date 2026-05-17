import { Test, TestingModule } from "@nestjs/testing";
import { ShowcaseService } from "./showcase.service";
import { DRIZZLE_CONNECTION } from "../../core/database/drizzle";
import { HttpException } from "@nestjs/common";

describe("ShowcaseService", () => {
  let service: ShowcaseService;
  let db: any;

  const mockShowcase = {
    id: "sc-uuid-1",
    title: "Payment Gateway",
    slug: "payment-gateway",
    description: "A payment gateway architecture",
    thumbnail: "https://example.com/thumb.png",
    diagramHistoryId: "dh-uuid-1",
    categoryId: "cat-uuid-1",
    prompt: "Design a payment gateway",
    engineVersion: "v4.2",
    logicFlowDescription: "Event sourcing",
    securityLayerDescription: "TLS 1.3",
    diagramType: "Architecture",
    nodeCount: 24,
    complexityLevel: 3,
    estimatedCredits: 5,
    buildVersion: "STABLE_BUILD_V2",
    createdBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    db = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockShowcase]),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockShowcase]),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
    };

    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        ShowcaseService,
        { provide: DRIZZLE_CONNECTION, useValue: db },
      ],
    }).compile();

    service = mod.get(ShowcaseService);
  });

  it("should be defined", () => expect(service).toBeDefined());

  describe("findAll", () => {
    it("should return showcases with category join", async () => {
      db.leftJoin.mockResolvedValue([mockShowcase]);
      const result = await service.findAll();
      expect(db.select).toHaveBeenCalled();
      expect(db.leftJoin).toHaveBeenCalled();
    });
  });

  describe("findBySlug", () => {
    it("should return showcase detail by slug", async () => {
      const result = await service.findBySlug("payment-gateway");
      expect(result).toEqual(mockShowcase);
    });

    it("should throw HttpException if not found", async () => {
      db.limit.mockResolvedValue([]);
      await expect(service.findBySlug("nonexistent")).rejects.toThrow(HttpException);
    });
  });

  describe("findOne", () => {
    it("should return showcase by id", async () => {
      const result = await service.findOne("sc-uuid-1");
      expect(result).toEqual(mockShowcase);
    });

    it("should throw HttpException if not found", async () => {
      db.limit.mockResolvedValue([]);
      await expect(service.findOne("nonexistent")).rejects.toThrow(HttpException);
    });
  });

  describe("create", () => {
    it("should create and return a showcase", async () => {
      const dto = {
        title: "Payment Gateway",
        slug: "payment-gateway",
        description: "A payment gateway architecture",
        thumbnail: "https://example.com/thumb.png",
        diagramHistoryId: "dh-uuid-1",
        categoryId: "cat-uuid-1",
        prompt: "Design a payment gateway",
        diagramType: "Architecture",
      };
      const result = await service.create(dto, "user-uuid-1");
      expect(db.insert).toHaveBeenCalled();
      expect(result).toEqual(mockShowcase);
    });

    it("should create with null createdBy if no userId", async () => {
      const dto = {
        title: "Payment Gateway",
        slug: "payment-gateway",
        description: "desc",
        thumbnail: "url",
        diagramHistoryId: "dh-1",
        categoryId: "cat-1",
        prompt: "prompt",
        diagramType: "Architecture",
      };
      await service.create(dto);
      expect(db.values).toHaveBeenCalledWith(expect.objectContaining({ createdBy: null }));
    });
  });

  describe("update", () => {
    it("should update and return the showcase", async () => {
      db.returning.mockResolvedValue([{ ...mockShowcase, title: "Updated" }]);
      const result = await service.update("sc-uuid-1", { title: "Updated" });
      expect(db.update).toHaveBeenCalled();
      expect(result.title).toBe("Updated");
    });
  });

  describe("remove", () => {
    it("should delete the showcase", async () => {
      const result = await service.remove("sc-uuid-1");
      expect(db.delete).toHaveBeenCalled();
      expect(result).toEqual({ message: "Showcase deleted successfully" });
    });
  });
});
