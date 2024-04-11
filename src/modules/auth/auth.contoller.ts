import { Response, Request } from "express";
import { AuthService, AuthLoginDto, AuthCheckOtpDto } from ".";
import { Logger } from "winston";

class AuthController {
  constructor(
    private readonly authService: AuthService,
    private logger: Logger,
  ) {}

  async LoginC(req: Request, res: Response) {
    this.logger.info("call LoginC()");

    const authDto: AuthLoginDto = req.body;
    const message = await this.authService.LoginS(authDto);
    res.json(message);

    // return authDto
  }

  async checkOtpC(req: Request, res: Response) {
    this.logger.info("call checkOtpC()");

    const authCheckOtpDto: AuthCheckOtpDto = req.body;
    const message = await this.authService.checkOtpS(authCheckOtpDto);
    res.json(message);

    // return authDto
  }
}

export default AuthController;
