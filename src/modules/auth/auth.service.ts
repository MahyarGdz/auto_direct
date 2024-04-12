import { AuthMessage, AuthMessageResponse } from "../../common/enums";
import { UnauthorizedError } from "../../common/error/app.error";
import { UserService, UserRepository } from "../users";
import { AuthLoginDto, AuthCheckOtpDto } from ".";
import * as crypto from "crypto";
import * as NodeCache from "node-cache";
import { JwtToken } from "../../utils";
import { SMS } from "../../helpers";

class AuthService {
  constructor(
    private userService: UserService,
    private cache: NodeCache,
    private readonly UserRepository: UserRepository,
  ) {}

  // Login Service
  async LoginS(data: AuthLoginDto) {
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
  async checkOtpS(data: AuthCheckOtpDto) {
    const { otpCode, phone } = data;

    const key = `${phone}:Login:Otp`;

    // check otpCode and delete it after get the key
    const codeInCache = this.cache.get(key);
    if (!codeInCache || otpCode !== codeInCache) throw new UnauthorizedError(AuthMessage.OtpIncorrect);

    this.cache.del(key);

    // check user exist
    let user = await this.userService.findUserByPhone(phone);
    if (!user) {
      user = this.UserRepository.create({ phone: phone, fullname: `U-${phone}` });
      await this.UserRepository.save(user);
    }

    // generate Access Token And Refresh Token

    const AccessToken = JwtToken.generateAccessToken({ sub: user.id }, `${process.env.JWT_SECRET}`);
    const RefreshToken = JwtToken.generateRefreshToken({ sub: user.id }, `${process.env.JWT_SECRET}`);

    //
    return {
      message: AuthMessageResponse.LoginSuccess,
      accessToken: AccessToken,
      refreshToken: RefreshToken,
      userInfo: user,
    };
  }

  // Save OtpCode in Cache
  async saveOtpCodeInCache(otpCode: string, phone: string) {
    const key = `${phone}:Login:Otp`;

    //check otpCode exist in cache
    console.log(this.cache.keys());
    //key doesnt store twice check the console after each request abolfazl
    // const codeInCache = this.cache.has(key);
    // if (codeInCache) this.cache.del(key);

    // save otpCode in cache
    this.cache.set(key, otpCode, 120);
    console.log(`${phone}:Login:Otp : ` + otpCode);
  }

  private generateOtpCode(): string {
    return crypto.randomInt(10000, 99999).toString();
  }
}

export default AuthService;
