import { Test, TestingModule } from "@nestjs/testing";
import { ShowcaseController } from "./showcase.controller";
import { ShowcaseService } from "./showcase.service";

describe("ShowcaseController", () => {
  let controller: ShowcaseController;
  let service: jest.Mocked<ShowcaseService>;

  const mockShowcase = {
    id: "sc-1",
    title: "Payment Gateway",
    slug: "payment-gateway",
    description: "desc",
    thumbnail: "url",
    diagramType: "Architecture",
    nodeCount: 24,
    complexityLevel: 3,
    estimatedCredits: 5,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      controllers: [ShowcaseController],
      providers: [
        {
          provide: ShowcaseService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockShowcase]),
            findBySlug: jest.fn().mockResolvedValue(mockShowcase),
            create: jest.fn().mockResolvedValue(mockShowcase),
            update: jest.fn().mockResolvedValue(mockShowcase),
            remove: jest.fn().mockResolvedValue({ message: "Showcase deleted successfully" }),
          },
        },
      ],
    }).compile();

    controller = mod.get(ShowcaseController);
    service = mod.get(ShowcaseService);
  });

  it("should be defined", () => expect(controller).toBeDefined());

  describe("findAll (public)", () => {
    it("should return all showcases", async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockShowcase]);
    });
  });

  describe("findBySlug (public)", () => {
    it("should return showcase detail by slug", async () => {
      const result = await controller.findBySlug("payment-gateway");
      expect(service.findBySlug).toHaveBeenCalledWith("payment-gateway");
      expect(result).toEqual(mockShowcase);
    });
  });

  describe("create (protected)", () => {
    it("should create a showcase with userId from request", async () => {
      const req = { user: { sub: "user-uuid-1" } };
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
      const result = await controller.create(req, dto);
      expect(service.create).toHaveBeenCalledWith(dto, "user-uuid-1");
      expect(result).toEqual(mockShowcase);
    });
  });

  describe("update (protected)", () => {
    it("should update a showcase", async () => {
      const result = await controller.update("sc-1", { title: "Updated" });
      expect(service.update).toHaveBeenCalledWith("sc-1", { title: "Updated" });
    });
  });

  describe("remove (protected)", () => {
    it("should delete a showcase", async () => {
      const result = await controller.remove("sc-1");
      expect(service.remove).toHaveBeenCalledWith("sc-1");
      expect(result).toEqual({ message: "Showcase deleted successfully" });
    });
  });
});
