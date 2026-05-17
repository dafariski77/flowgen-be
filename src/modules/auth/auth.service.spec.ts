import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

jest.mock("bcrypt");

describe("AuthService", () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: "user-uuid-1",
    name: "John Doe",
    email: "john@example.com",
    password: "$2b$10$hashedpassword",
    provider: "local",
    providerId: null,
    tier: "free",
    credits: 10,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue("mock-jwt-token"),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("register", () => {
    const registerDto = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };

    it("should register a new user and return a token", async () => {
      usersService.findByEmail.mockResolvedValue(null as any);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
      usersService.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith("john@example.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(usersService.create).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "hashed_password",
        provider: "local",
      });
      expect(result).toEqual({ access_token: "mock-jwt-token" });
    });

    it("should throw BadRequestException if user already exists", async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("login", () => {
    const loginDto = {
      email: "john@example.com",
      password: "password123",
    };

    it("should login and return a token for valid credentials", async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith("john@example.com");
      expect(result).toEqual({ access_token: "mock-jwt-token" });
    });

    it("should throw UnauthorizedException if user not found", async () => {
      usersService.findByEmail.mockResolvedValue(null as any);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should throw UnauthorizedException if provider is not local", async () => {
      usersService.findByEmail.mockResolvedValue({
        ...mockUser,
        provider: "google",
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should throw UnauthorizedException if password is invalid", async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe("googleLogin", () => {
    const googleUser = {
      email: "google@example.com",
      name: "Google User",
      provider: "google",
      providerId: "google-id-123",
    };

    it("should create a new user if not found and return token", async () => {
      usersService.findByEmail.mockResolvedValue(null as any);
      usersService.create.mockResolvedValue({
        ...mockUser,
        ...googleUser,
        id: "new-user-id",
      });

      const result = await service.googleLogin(googleUser);

      expect(usersService.create).toHaveBeenCalledWith(googleUser);
      expect(result).toEqual({ access_token: "mock-jwt-token" });
    });

    it("should return token for existing user", async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.googleLogin(googleUser);

      expect(usersService.create).not.toHaveBeenCalled();
      expect(result).toEqual({ access_token: "mock-jwt-token" });
    });
  });
});
