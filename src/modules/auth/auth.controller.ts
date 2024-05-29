import { Response, Request } from "express";
import { controller, httpGet, httpPost, request, response } from "inversify-express-utils";
import { inject } from "inversify";

import { AuthLoginDto, AuthCheckOtpDto, TokenDto } from "./dto";
import { IOCTYPES } from "../../IOC/ioc.types";
import { ILogger, baseController } from "../../common";
import { IAuthService } from "./interfaces/IAuthService";
import { ValidationMiddleware, Guard } from "../../core";

@controller("/auth")
class AuthController extends baseController {
  @inject(IOCTYPES.AuthService) private authService: IAuthService;
  @inject(IOCTYPES.Logger) private logger: ILogger;

  @httpPost("/login", ValidationMiddleware.validateInput(AuthLoginDto))
  public async loginC(@request() req: Request, @response() res: Response) {
    this.logger.info("call loginC()");
    const authDto: AuthLoginDto = req.body;
    const message = await this.authService.loginS(authDto);
    // return authDto
    res.json(message);
  }

  @httpPost("/check-otp", ValidationMiddleware.validateInput(AuthCheckOtpDto))
  public async checkOtpC(@request() req: Request, @response() res: Response) {
    this.logger.info("call checkOtpC()");
    const authCheckOtpDto: AuthCheckOtpDto = req.body;
    const message = await this.authService.checkOtpS(authCheckOtpDto);
    // return authDto
    res.json(message);
  }
  @httpPost("/refresh-token", ValidationMiddleware.validateInput(TokenDto))
  public async refreshTokens(@request() req: Request, @response() res: Response) {
    this.logger.info("call refreshTokons()");
    const token: TokenDto = req.body;
    const message = await this.authService.refreshTokensS(token);
    res.json(message);
  }

  @httpGet("/secret", Guard.authJwt())
  public async testSecret(@request() req: Request, @response() res: Response) {
    const { user } = req;
    res.json({ user });
  }

  @httpGet("/facebookNew")
  public async connectFbAccount() {
    return Guard.oAuth("facebook");
  }
  //
  @httpGet("/facebook/callback", Guard.oAuthCallback("facebook"))
  public async fbCallback(@request() req: Request, @response() res: Response) {
    res.json({ user: req.user });
  }
}

export { AuthController };
