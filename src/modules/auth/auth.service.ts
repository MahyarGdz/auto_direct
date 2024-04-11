import { AuthType } from "../../common/enums";
import { NotFoundError } from "../../common/error/app.error";
import { UserService } from "../users/user.service";
import { AuthLoginDto } from "./dto/authLogin.dto";
import * as crypto from "crypto";
import * as NodeCache from "node-cache";

export class AuhtService {
  constructor(
    private userService: UserService,
    private cache: NodeCache,
  ) {}

  // Login Service
  async LoginS(data: AuthLoginDto) {

    const { phone } = data;
    const user = await this.userService.findUserByPhone(phone);

    const otpCode = crypto.randomInt(10000, 99999).toString();

    // send otp to user
    //--
    //--

    // save code in cach
    const key = `${phone}:Login:Otp`;
    this.cache.set(key, otpCode, 120);

    //

    if (!user) {
      return {
        type: AuthType.Register,
        code: otpCode,
        phone:phone
      };
    }

    return {
      type: AuthType.Login,
      code: otpCode,
      phone:phone
    };
  }
}
