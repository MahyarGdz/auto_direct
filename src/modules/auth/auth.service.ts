import { AuthMessage, AuthMessageResponse } from "../../common/enums";
import { UnauthorizedError } from "../../common/error/app.error";
import { UserService, UserRepository } from "../users";
import { AuthLoginDto, AuthCheckOtpDto } from ".";
import { TokenService, SMS } from "../../utils";
import * as crypto from "crypto";
import * as NodeCache from "node-cache";

class AuthService {
  private tokenService: TokenService;
  private userService: UserService;
  private cache: NodeCache;
  private readonly userRepository: UserRepository;

  constructor(userService: UserService, cache: NodeCache, userRepository: UserRepository) {
    this.userService = userService;
    this.cache = cache;
    this.userRepository = userRepository;
    this.tokenService = new TokenService();
  }

  // Login Service
  public async LoginS(data: AuthLoginDto) {
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
    let user = await this.userService.findUserByPhone(phone);
    if (!user) {
      user = this.userRepository.create({ phone: phone, fullname: `U-${phone}` });
      await this.userRepository.save(user);
    }
    // generate Access Token And Refresh Token
    const { accessToken, refreshToken } = this.tokenService.generateAuthTokens({ sub: user.id });
    //
    return {
      message: AuthMessageResponse.LoginSuccess,
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

  private generateOtpCode(): string {
    return crypto.randomInt(10000, 99999).toString();
  }
}

export default AuthService;
