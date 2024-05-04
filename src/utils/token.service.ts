import jwt, { TokenExpiredError, SignOptions } from "jsonwebtoken";
import { AuthTokenPayload, ILogger, ITokenService, Token } from "../common";
import { jwtExpiredErr } from "../core/app/app.errors";
import { inject, injectable } from "inversify";
import { IOCTYPES } from "../IOC/ioc.types";

@injectable()
export class TokenService implements ITokenService {
  private static jwtSecret: string = process.env.JWT_SECRET || "";
  @inject(IOCTYPES.Logger) private logger: ILogger;

  public _generateToken(payload: AuthTokenPayload, option: SignOptions) {
    return jwt.sign(payload, TokenService.jwtSecret, { ...option });
  }
  public generateAuthTokens(payload: AuthTokenPayload) {
    const accessToken = this._generateToken(payload, { expiresIn: "15m" });
    const refreshToken = this._generateToken(payload, { expiresIn: "1h" });
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
      this.logger.error(error);
      throw error;
    }
  }
}
