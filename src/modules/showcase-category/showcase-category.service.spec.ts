import { Test, TestingModule } from "@nestjs/testing";
import { ShowcaseCategoryService } from "./showcase-category.service";
import { DRIZZLE_CONNECTION } from "../../core/database/drizzle";
import { HttpException } from "@nestjs/common";

describe("ShowcaseCategoryService", () => {
  let service: ShowcaseCategoryService;
  let db: any;

  const mockCategory = {
    id: "cat-uuid-1",
    name: "Infrastructure",
    slug: "infrastructure",
    createdAt: new Date(),
  };

  beforeEach(async () => {
    db = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockCategory]),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockCategory]),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
    };

    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        ShowcaseCategoryService,
        { provide: DRIZZLE_CONNECTION, useValue: db },
      ],
    }).compile();

    service = mod.get(ShowcaseCategoryService);
  });

  it("should be defined", () => expect(service).toBeDefined());

  describe("findAll", () => {
    it("should return all categories", async () => {
      db.from.mockResolvedValueOnce([mockCategory]);
      const result = await service.findAll();
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a category by id", async () => {
      const result = await service.findOne("cat-uuid-1");
      expect(result).toEqual(mockCategory);
    });

    it("should throw HttpException if not found", async () => {
      db.limit.mockResolvedValue([]);
      await expect(service.findOne("nonexistent")).rejects.toThrow(HttpException);
    });
  });

  describe("create", () => {
    it("should create and return a category", async () => {
      const dto = { name: "Infrastructure", slug: "infrastructure" };
      const result = await service.create(dto);
      expect(db.insert).toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    });
  });

  describe("update", () => {
    it("should update and return the category", async () => {
      db.returning.mockResolvedValue([{ ...mockCategory, name: "Updated" }]);
      const result = await service.update("cat-uuid-1", { name: "Updated" });
      expect(db.update).toHaveBeenCalled();
      expect(result.name).toBe("Updated");
    });
  });

  describe("remove", () => {
    it("should delete the category", async () => {
      // findOne will use select().from().where().limit() -> returns mockCategory
      // then delete().from() is not in the chain, it uses delete().where()
      const result = await service.remove("cat-uuid-1");
      expect(db.delete).toHaveBeenCalled();
      expect(result).toEqual({ message: "Showcase category deleted successfully" });
    });
  });
});
