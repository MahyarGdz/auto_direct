import { Response, Request } from "express";
import { Logger } from "winston";
import { AuthLoginDto } from "./dto/authLogin.dto";
import { AuhtService } from "./auth.service";
import { AuthCheckOtpDto } from "./dto/auth.checkOtp.dto";

export class AuthController {
  constructor(
    private readonly authService:AuhtService,
    private logger: Logger,
  ) {}

  //   async test(_req: Request, res: Response) {
  //     this.logger.info("calling test()");
  //     const msg = await this.userService.test();
  //     res.json({ msg });
  //   }

  async LoginC( req: Request, res: Response,) {

    this.logger.info("call LoginC()");

    const authDto: AuthLoginDto = req.body

    res.json( await this.authService.LoginS(authDto))


    // return authDto
  }

  async checkOtpC( req: Request, res: Response,) {

    this.logger.info("call checkOtpC()");

    const authCheckOtpDto: AuthCheckOtpDto = req.body

    res.json( await this.authService.checkOtpS(authCheckOtpDto))


    // return authDto
  }
}
