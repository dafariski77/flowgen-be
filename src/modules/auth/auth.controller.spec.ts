import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            googleLogin: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("register", () => {
    it("should call authService.register with dto", async () => {
      const dto = {
        name: "John",
        email: "john@example.com",
        password: "password123",
      };
      const expected = { access_token: "mock-token" };
      authService.register.mockResolvedValue(expected);

      const result = await controller.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe("login", () => {
    it("should call authService.login with dto", async () => {
      const dto = { email: "john@example.com", password: "password123" };
      const expected = { access_token: "mock-token" };
      authService.login.mockResolvedValue(expected);

      const result = await controller.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe("googleAuthRedirect", () => {
    it("should call authService.googleLogin with user from request", async () => {
      const req = {
        user: {
          email: "google@example.com",
          name: "Google User",
          provider: "google",
          providerId: "google-123",
        },
      };
      const expected = { access_token: "mock-token" };
      authService.googleLogin.mockResolvedValue(expected);

      const result = await controller.googleAuthRedirect(req);

      expect(authService.googleLogin).toHaveBeenCalledWith(req.user);
      expect(result).toEqual(expected);
    });
  });

  describe("getProfile", () => {
    it("should return the user from the request", () => {
      const req = {
        user: { sub: "user-id", email: "john@example.com", name: "John" },
      };

      const result = controller.getProfile(req);

      expect(result).toEqual(req.user);
    });
  });
});
