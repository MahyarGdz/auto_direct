import * as crypto from "crypto";
import Dayjs from "dayjs";

import { inject, injectable } from "inversify";
import { VerifiedCallback } from "passport-jwt";
import { Profile } from "passport-facebook";

import { NotFoundError, UnauthorizedError, ILogger } from "../../core/";
import { AuthMessage, AuthTokenPayload } from "../../common";
import { AuthLoginDto, AuthCheckOtpDto, TokenDto } from "./dto";
import { SMS, CacheService } from "../../utils";
import { IAuthService } from "./interfaces/IAuthService";
import { IOCTYPES } from "../../IOC/ioc.types";
import { UserRepository } from "../users/user.repository";
import { TokenService } from "../token/token.service";
import { TokenRepository } from "../token/token.repository";

@injectable()
class AuthService implements IAuthService {
  @inject(IOCTYPES.TokenService) private tokenService: TokenService;
  @inject(IOCTYPES.TokenRepository) private tokenRepository: TokenRepository;
  @inject(IOCTYPES.UserRepository) private userRepository: UserRepository;
  @inject(IOCTYPES.CacheService) private cache: CacheService;
  @inject(IOCTYPES.Logger) private logger: ILogger;

  // Login Service
  public async loginS(data: AuthLoginDto) {
    const { phone } = data;
    const otpCode = this.generateOtpCode();
    // send otp to user
    await SMS.sendSmsVerifyCode(phone, otpCode);
    // save code in cach
    await this.saveOtpCodeInCache(otpCode, phone);
    return {
      message: "An otp code was sent to the following phone number",
      phone: phone,
    };
  }
  // check-otp Service
  public async checkOtpS(data: AuthCheckOtpDto) {
    const { otpCode, phone } = data;
    const key = `${phone}:Login:Otp`;
    // check otpCode and delete it after get the key
    const codeInCache = this.cache.get(key);
    if (!codeInCache || otpCode !== codeInCache) throw new UnauthorizedError(AuthMessage.OtpIncorrect);
    this.cache.del(key);
    // check user exist
    let user = await this.userRepository.findUserByPhone(phone);
    if (!user) {
      user = this.userRepository.create({ phone: phone, fullname: `U-${phone}` });
      await this.userRepository.save(user);
    }
    // generate Access Token And Refresh Token
    const { accessToken, refreshToken } = await this.tokenService.generateAuthTokens({ sub: user.id }, user);
    //
    return {
      tokenType: "Bearer",
      message: AuthMessage.LoginSuccess,
      accessToken,
      refreshToken,
      userInfo: user,
    };
  }
  // Save OtpCode in Cache
  public async saveOtpCodeInCache(otpCode: string, phone: string) {
    const key = `${phone}:Login:Otp`;
    this.cache.set(key, otpCode, 120);
    console.log(`${phone}:Login:Otp : ` + otpCode);
  }
  // refersh  both token with refersh token
  public async refreshTokensS(data: TokenDto) {
    const refTokens = await this.tokenRepository.findOne({ where: { refreshToken: data.token } });

    if (!refTokens) throw new NotFoundError("RefreshToken Not Found");

    if (Dayjs(refTokens.refreshTokenExpires).isBefore(Dayjs())) {
      await this.tokenRepository.remove(refTokens);
      throw new UnauthorizedError("refresh token has been expired!");
    }
    const { accessToken, refreshToken } = await this.tokenService.generateAuthTokens({ sub: refTokens.user.id }, refTokens.user);

    return {
      tokenType: "Bearer",
      accessToken,
      refreshToken,
    };
  }
  //generate otp code
  public generateOtpCode(): string {
    return crypto.randomInt(10000, 99999).toString();
  }

  // use arrow function to avoid lossing this context when pass the method to passport startegy
  public jwt = async (payload: AuthTokenPayload, done: VerifiedCallback) => {
    try {
      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      this.logger.error(error);
      done(error, false);
    }
  };

  public oAuth = async (token: string, refreshToken: string, profile: Profile, done: VerifiedCallback): Promise<void> => {
    try {
      console.log(token);
      console.log("=========================");

      console.log(refreshToken);
      console.log("=========================");

      console.log(profile);
      console.log("=========================");

      done(null, profile);
    } catch (err) {
      return done(err, false);
    }
  };
}

export { AuthService };
