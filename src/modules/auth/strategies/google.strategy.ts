import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback, Profile } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || "client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "client-secret",
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/auth/google/callback",
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, id } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : "";
    const givenName = name?.givenName || "";
    const familyName = name?.familyName ? " " + name.familyName : "";

    const user = {
      provider: "google",
      providerId: id,
      email: email,
      name: givenName + familyName,
    };
    done(null, user);
  }
}
