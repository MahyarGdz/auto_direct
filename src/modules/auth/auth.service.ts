import NodeCache from "node-cache";
import * as crypto from "crypto";
import { inject, injectable } from "inversify";
import { NotFoundError, UnauthorizedError } from "../../core/";
import { AuthMessage, ITokenService, type Token } from "../../common";
import { AuthLoginDto, AuthCheckOtpDto, TokenDto } from "./dto";
import { SMS } from "../../utils";
import { IAuthService } from "./interfaces/IAuthService";
import { IOCTYPES } from "../../IOC/ioc.types";
import { UserRepository } from "../users/user.repository";

@injectable()
class AuthService implements IAuthService {
  @inject(IOCTYPES.TokenService) private tokenService: ITokenService;
  @inject(IOCTYPES.UserRepository) private userRepository: UserRepository;
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache();
  }
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
    const { accessToken, refreshToken } = this.tokenService.generateAuthTokens({ sub: user.id });
    //
    return {
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
    const { token } = data;
    const { sub } = this.tokenService.verifyToken(token as Token);
    const user = await this.userRepository.findOne({ where: { id: sub as string } });
    if (!user) throw new NotFoundError("user not found by give id");
    const tokens = this.tokenService.generateAuthTokens({ sub: user.id });
    return tokens;
  }
  //generate otp code
  public generateOtpCode(): string {
    return crypto.randomInt(10000, 99999).toString();
  }
}

export { AuthService };
