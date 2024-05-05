import { Response, Request } from "express";
import { AuthLoginDto, AuthCheckOtpDto, TokenDto } from "./dto";
import { inject, injectable } from "inversify";
import { IOCTYPES } from "../../IOC/ioc.types";
import { ILogger } from "../../common";
import { IAuthController } from "./interfaces/IAuthController";
import { IAuthService } from "./interfaces/IAuthService";

@injectable()
class AuthController implements IAuthController {
  @inject(IOCTYPES.AuthService) private authService: IAuthService;
  @inject(IOCTYPES.Logger) private logger: ILogger;

  public loginC = async (req: Request, res: Response) => {
    this.logger.info("call loginC()");
    const authDto: AuthLoginDto = req.body;
    const message = await this.authService.loginS(authDto);
    // return authDto
    res.json(message);
  };

  public checkOtpC = async (req: Request, res: Response) => {
    this.logger.info("call checkOtpC()");
    const authCheckOtpDto: AuthCheckOtpDto = req.body;
    const message = await this.authService.checkOtpS(authCheckOtpDto);
    // return authDto
    res.json(message);
  };
  public refreshTokens = async (req: Request, res: Response) => {
    this.logger.info("call refreshTokons()");
    const token: TokenDto = req.body;
    const message = await this.authService.refreshTokensS(token);
    res.json(message);
  };
}

export { AuthController };
