import { Test, TestingModule } from "@nestjs/testing";
import { DiagramsService } from "./diagrams.service";
import { DRIZZLE_CONNECTION } from "../../core/database/drizzle";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("DiagramsService", () => {
  let service: DiagramsService;
  let mockDb: any;

  const mockUser = {
    id: "user-uuid-1",
    name: "John Doe",
    email: "john@example.com",
    credits: 5,
  };

  const mockDiagram = {
    id: "diagram-uuid-1",
    userId: "user-uuid-1",
    title: "New Diagram",
    diagramType: "flowchart",
    mermaidCode: "graph TD; A-->B;",
    createdAt: new Date(),
  };

  beforeEach(async () => {
    mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockUser]),
      orderBy: jest.fn().mockResolvedValue([mockDiagram]),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockDiagram]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiagramsService,
        { provide: DRIZZLE_CONNECTION, useValue: mockDb },
      ],
    }).compile();

    service = module.get<DiagramsService>(DiagramsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("generateDiagram", () => {
    it("should generate a diagram and deduct credits", async () => {
      const result = await service.generateDiagram("user-uuid-1", "Create a flowchart");

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.insert).toHaveBeenCalled();
      expect(result).toEqual(mockDiagram);
    });

    it("should throw NOT_FOUND if user does not exist", async () => {
      mockDb.limit.mockResolvedValue([]);

      await expect(
        service.generateDiagram("nonexistent-id", "Create a flowchart"),
      ).rejects.toThrow(
        new HttpException("User not found", HttpStatus.NOT_FOUND),
      );
    });

    it("should throw PAYMENT_REQUIRED if user has no credits", async () => {
      mockDb.limit.mockResolvedValue([{ ...mockUser, credits: 0 }]);

      await expect(
        service.generateDiagram("user-uuid-1", "Create a flowchart"),
      ).rejects.toThrow(
        new HttpException(
          "Payment Required: Saldo kredit Anda habis. Silakan top up.",
          HttpStatus.PAYMENT_REQUIRED,
        ),
      );
    });
  });

  describe("getHistory", () => {
    it("should return diagram history for a user", async () => {
      const result = await service.getHistory("user-uuid-1");

      expect(mockDb.select).toHaveBeenCalled();
      expect(result).toEqual([mockDiagram]);
    });
  });
});
