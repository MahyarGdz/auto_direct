import jwt, { TokenExpiredError, SignOptions } from "jsonwebtoken";
import DayJs from "dayjs";
import { randomBytes } from "node:crypto";
import { inject, injectable } from "inversify";
import { IOCTYPES } from "../../IOC/ioc.types";
import { ILogger, jwtExpiredErr } from "../../core";
import { AuthTokenPayload, TokenType } from "../../common";
import { TokenRepository } from "./token.repository";
import { UsersEntity } from "../../models";

@injectable()
export class TokenService {
  @inject(IOCTYPES.Logger) private logger: ILogger;
  @inject(IOCTYPES.TokenRepository) private tokenRepository: TokenRepository;
  private static jwtSecret: string = process.env.JWT_SECRET || "";
  private jwt_access_expire: string = process.env.JWT_EXPIRE_ACCESS || "30m";
  private jwt_refresh_expire: string = process.env.JWT_EXPIRE_REFRESH || "2d";

  public _generateToken(type: TokenType, payload: AuthTokenPayload, option?: SignOptions) {
    if (type == "Access" && option?.expiresIn) return jwt.sign(payload, TokenService.jwtSecret, { ...option });
    const refToken = randomBytes(24).toString("hex");
    return refToken;
  }
  public async generateAuthTokens(payload: AuthTokenPayload, user: UsersEntity) {
    const accessToken = this._generateToken("Access", payload, { expiresIn: `${this.jwt_access_expire}m` });
    const refreshToken = this._generateToken("Refresh", payload);
    const RefreshExpire = DayJs().add(+this.jwt_refresh_expire, "day").toDate();

    const oldToken = await this.tokenRepository.findOne({ where: { user: { id: user.id } } });
    if (oldToken) {
      await this.tokenRepository.remove(oldToken);
    }

    const token = this.tokenRepository.create({ refreshToken, user, refreshTokenExpires: RefreshExpire });
    await this.tokenRepository.save(token);

    const tokens = {
      accessToken: {
        token: accessToken,
        expires: DayJs().add(+this.jwt_access_expire, "m").unix().toString(),
      },
      refreshToken: {
        token: refreshToken,
        expires: DayJs().add(+this.jwt_refresh_expire, "day").unix().toString(),
      },
    };
    return tokens;
  }
  public verifyToken(token: string) {
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
