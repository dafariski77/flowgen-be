import { Test, TestingModule } from "@nestjs/testing";
import { UsersRepository } from "./users.repository";
import { DRIZZLE_CONNECTION } from "../../core/database/drizzle";

describe("UsersRepository", () => {
  let repository: UsersRepository;
  let mockDb: any;

  const mockUser = {
    id: "user-uuid-1",
    name: "John Doe",
    email: "john@example.com",
    password: "hashed_password",
    provider: "local",
    providerId: null,
    tier: "free",
    credits: 10,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockUser]),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockUser]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        { provide: DRIZZLE_CONNECTION, useValue: mockDb },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("findByEmail", () => {
    it("should return a user when found", async () => {
      const result = await repository.findByEmail("john@example.com");

      expect(mockDb.select).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should return null when user not found", async () => {
      mockDb.limit.mockResolvedValue([]);

      const result = await repository.findByEmail("notfound@example.com");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create and return a new user", async () => {
      const createData = {
        name: "John Doe",
        email: "john@example.com",
        password: "hashed_password",
        provider: "local",
      };

      const result = await repository.create(createData);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });
});
