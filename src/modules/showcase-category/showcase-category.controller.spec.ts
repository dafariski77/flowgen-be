import { Test, TestingModule } from "@nestjs/testing";
import { ShowcaseCategoryController } from "./showcase-category.controller";
import { ShowcaseCategoryService } from "./showcase-category.service";

describe("ShowcaseCategoryController", () => {
  let controller: ShowcaseCategoryController;
  let service: jest.Mocked<ShowcaseCategoryService>;

  const mockCategory = { id: "cat-1", name: "Infrastructure", slug: "infrastructure", createdAt: new Date() };

  beforeEach(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      controllers: [ShowcaseCategoryController],
      providers: [
        {
          provide: ShowcaseCategoryService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockCategory]),
            findOne: jest.fn().mockResolvedValue(mockCategory),
            create: jest.fn().mockResolvedValue(mockCategory),
            update: jest.fn().mockResolvedValue(mockCategory),
            remove: jest.fn().mockResolvedValue({ message: "Showcase category deleted successfully" }),
          },
        },
      ],
    }).compile();

    controller = mod.get(ShowcaseCategoryController);
    service = mod.get(ShowcaseCategoryService);
  });

  it("should be defined", () => expect(controller).toBeDefined());

  it("findAll should return categories", async () => {
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockCategory]);
  });

  it("findOne should return a category", async () => {
    const result = await controller.findOne("cat-1");
    expect(service.findOne).toHaveBeenCalledWith("cat-1");
    expect(result).toEqual(mockCategory);
  });

  it("create should return the created category", async () => {
    const dto = { name: "Infrastructure", slug: "infrastructure" };
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockCategory);
  });

  it("update should return the updated category", async () => {
    const dto = { name: "Updated" };
    const result = await controller.update("cat-1", dto);
    expect(service.update).toHaveBeenCalledWith("cat-1", dto);
  });

  it("remove should return success message", async () => {
    const result = await controller.remove("cat-1");
    expect(service.remove).toHaveBeenCalledWith("cat-1");
    expect(result).toEqual({ message: "Showcase category deleted successfully" });
  });
});
