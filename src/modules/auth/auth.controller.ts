import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import type { Response } from "express";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The user has been successfully registered.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "User already exists or invalid data.",
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @ApiOperation({ summary: "Login user with email and password" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful login returning JWT.",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Invalid credentials.",
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get("google/url")
  @ApiOperation({ summary: "Get Google OAuth redirect URL" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Returns the Google OAuth URL for frontend redirect.",
  })
  getGoogleAuthUrl() {
    const clientId = process.env.GOOGLE_CLIENT_ID || "client-id";
    const callbackUrl =
      process.env.GOOGLE_CALLBACK_URL ||
      "http://localhost:3000/auth/google/callback";
    const scope = encodeURIComponent("email profile");

    const url =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(callbackUrl)}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&access_type=offline` +
      `&prompt=consent`;

    return { url };
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "Google OAuth callback — redirects to frontend" })
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { access_token } = await this.authService.googleLogin(req.user);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
    res.redirect(`${frontendUrl}/api/auth/callback?token=${access_token}`);
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Get current logged in user profile" })
  @ApiResponse({ status: HttpStatus.OK, description: "Current user profile." })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized access.",
  })
  getProfile(@Req() req) {
    return req.user;
  }
}
