import jwt, { TokenExpiredError, SignOptions } from "jsonwebtoken";
import { AuthTokenPayload, Token } from "../common";
import { Logger } from "../core";
import { jwtExpiredErr } from "../core/app/app.errors";

const logger = new Logger();
export class TokenService {
  private static jwtSecret: string = process.env.JWT_SECRET || "";

  private generateToken(payload: AuthTokenPayload, option: SignOptions) {
    return jwt.sign(payload, TokenService.jwtSecret, { ...option });
  }
  public generateAuthTokens(payload: AuthTokenPayload) {
    const accessToken = this.generateToken(payload, { expiresIn: "15m" });
    const refreshToken = this.generateToken(payload, { expiresIn: "1h" });
    const tokens = {
      accessToken: {
        token: accessToken,
        expires: "15m",
      },
      refreshToken: {
        token: refreshToken,
        expires: "1h",
      },
    };
    return tokens;
  }
  public verifyToken(token: Token) {
    try {
      const decoded = jwt.verify(token, TokenService.jwtSecret);
      return decoded;
    } catch (error) {
      if (error instanceof TokenExpiredError) throw new jwtExpiredErr();
      logger.error(error);
      throw error;
    }
  }
}
