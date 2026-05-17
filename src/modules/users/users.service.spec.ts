import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { UsersRepository } from "./users.repository";

describe("UsersService", () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

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
    const mockUsersRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findByEmail", () => {
    it("should return a user when found", async () => {
      repository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail("john@example.com");

      expect(repository.findByEmail).toHaveBeenCalledWith("john@example.com");
      expect(result).toEqual(mockUser);
    });

    it("should return null when user not found", async () => {
      repository.findByEmail.mockResolvedValue(null as any);

      const result = await service.findByEmail("notfound@example.com");

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

      repository.create.mockResolvedValue(mockUser);

      const result = await service.create(createData);

      expect(repository.create).toHaveBeenCalledWith(createData);
      expect(result).toEqual(mockUser);
    });
  });
});
