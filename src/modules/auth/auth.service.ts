import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    // Check if user exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const newUser = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
      provider: "local",
    });

    return this.generateToken(newUser.id, newUser.email, newUser.name);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);

    if (!user || user.provider !== "local") {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.generateToken(user.id, user.email, user.name);
  }

  async googleLogin(reqUser: {
    email: string;
    name: string;
    provider: string;
    providerId: string;
  }) {
    const { email, name, provider, providerId } = reqUser;

    // Check if user exists
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      // Create user if they don't exist
      user = await this.usersService.create({
        email,
        name,
        provider,
        providerId,
      });
    } else if (user.provider === "local" && !user.providerId) {
      // if we want to link accounts, we could update the providerId, but let's keep it simple
      // or just return the token if email matches
    }

    return this.generateToken(user.id, user.email, user.name);
  }

  private generateToken(userId: string, email: string, name: string) {
    const payload = { sub: userId, email, name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
