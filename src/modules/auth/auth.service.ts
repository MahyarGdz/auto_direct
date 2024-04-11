import { Code } from "typeorm";
import { AuthMessage, AuthMessageResponse } from "../../common/enums";
import { NotFoundError, UnauthorizedError } from "../../common/error/app.error";
import { UserService } from "../users/user.service";
import { AuthLoginDto } from "./dto/authLogin.dto";
import * as crypto from "crypto";
import * as NodeCache from "node-cache";
import { AuthCheckOtpDto } from "./dto/auth.checkOtp.dto";
import UserRepository from "../users/user.repository";

export class AuhtService {
  constructor(
    private userService: UserService,
    private cache: NodeCache,
    private readonly UserRepository: UserRepository,
  ) {}

  // Login Service
  async LoginS(data: AuthLoginDto) {
    const { phone } = data;

    const otpCode = crypto.randomInt(10000, 99999).toString();

    // send otp to user
    //--
    //--

    // save code in cach
    this.saveOtp(otpCode, phone);

    //

    return {
      phone: phone,
    };
  }

  // check-otp Service
  async checkOtpS(data: AuthCheckOtpDto) {
    const { otpCode, phone } = data;

    const key = `${phone}:Login:Otp`;

    // check otpCode 
    const codeInCache = this.cache.get(key);
    if (!codeInCache || otpCode !== codeInCache) throw new UnauthorizedError(AuthMessage.OtpIncorrect);

    this.cache.del(key);

    // check user exist
    const user = await this.UserRepository.findOne({ where: { phone: phone } });
    if (!user) {
      const newuser = this.UserRepository.create({ phone: phone, fullname: `U-${phone}` });
      await this.UserRepository.save(newuser);
    }

    //
    return {
      message: AuthMessageResponse.LoginSuccess,
      accessToken: "sds --- ",
    };
  }

  // Save OtpCode in Cache
  async saveOtp(otpCode: string, phone: string) {
    const key = `${phone}:Login:Otp`;

    //check otpCode exist in cache
    const codeInCache = this.cache.get(key);
    if (codeInCache) this.cache.del(key);

    // save otpCode in cache
    this.cache.set(key, otpCode, 120);
    console.log(`${phone}:Login:Otp : ` + otpCode);
  }
}
