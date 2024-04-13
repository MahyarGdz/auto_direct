import jwt, { SignOptions } from "jsonwebtoken";
import { AuthTokenPayload } from "../common/types";

export class TokenService {
  private static jwtSecret: string = process.env.JWT_SECRET || "";
  constructor() {}
  private generateToken(payload: AuthTokenPayload, option: SignOptions) {
    return jwt.sign(payload, TokenService.jwtSecret, { ...option });
  }
  public generateAuthTokens(payload: AuthTokenPayload) {
    const accessToken = this.generateToken(payload, { expiresIn: "15m" });
    const refreshToken = this.generateToken(payload, { expiresIn: "1h" });
    return { accessToken, refreshToken };
  }
}
