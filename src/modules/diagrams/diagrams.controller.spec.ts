import { Test, TestingModule } from "@nestjs/testing";
import { DiagramsController } from "./diagrams.controller";
import { DiagramsService } from "./diagrams.service";

describe("DiagramsController", () => {
  let controller: DiagramsController;
  let service: jest.Mocked<DiagramsService>;

  const mockDiagram = {
    id: "diagram-uuid-1",
    userId: "user-uuid-1",
    title: "New Diagram",
    diagramType: "flowchart",
    mermaidCode: "graph TD; A-->B;",
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiagramsController],
      providers: [
        {
          provide: DiagramsService,
          useValue: {
            generateDiagram: jest.fn(),
            getHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DiagramsController>(DiagramsController);
    service = module.get(DiagramsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("generate", () => {
    it("should call service.generateDiagram with userId and prompt", async () => {
      const req = { user: { sub: "user-uuid-1" } };
      const body = { prompt: "Create a flowchart" };
      service.generateDiagram.mockResolvedValue(mockDiagram);

      const result = await controller.generate(req, body);

      expect(service.generateDiagram).toHaveBeenCalledWith(
        "user-uuid-1",
        "Create a flowchart",
      );
      expect(result).toEqual(mockDiagram);
    });
  });

  describe("history", () => {
    it("should call service.getHistory with userId", async () => {
      const req = { user: { sub: "user-uuid-1" } };
      service.getHistory.mockResolvedValue([mockDiagram]);

      const result = await controller.history(req);

      expect(service.getHistory).toHaveBeenCalledWith("user-uuid-1");
      expect(result).toEqual([mockDiagram]);
    });
  });
});
