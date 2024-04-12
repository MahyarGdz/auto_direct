import jwt from "jsonwebtoken";
import { AuthTokenPayload } from "../common/types";
export class JwtToken {
  static generateAccessToken(payload: AuthTokenPayload, secret: string) {
    return jwt.sign(payload, secret, { expiresIn: "15m" });
  }

  static generateRefreshToken(payload: AuthTokenPayload, secret: string) {
    return jwt.sign(payload, secret, { expiresIn: "1h" });
  }
}
