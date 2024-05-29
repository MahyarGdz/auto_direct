import { Response, Request } from "express";
import { controller, httpGet, httpPost, request, requestBody, response } from "inversify-express-utils";
import { inject } from "inversify";

import { AuthLoginDto, AuthCheckOtpDto, TokenDto } from "./dto";
import { IOCTYPES } from "../../IOC/ioc.types";
import { ILogger, Controller, HttpStatus } from "../../common";
import { IAuthService } from "./interfaces/IAuthService";
import { ValidationMiddleware, Guard } from "../../core";

@controller("/auth")
class AuthController extends Controller {
  @inject(IOCTYPES.AuthService) private authService: IAuthService;
  @inject(IOCTYPES.Logger) private logger: ILogger;

  @httpPost("/login", ValidationMiddleware.validateInput(AuthLoginDto))
  public async loginC(@requestBody() LoginData: AuthLoginDto) {
    this.logger.info("call loginC()");
    const message = await this.authService.loginS(LoginData);
    // return authDto
    return this.response(message, HttpStatus.Ok);
  }

  @httpPost("/check-otp", ValidationMiddleware.validateInput(AuthCheckOtpDto))
  public async checkOtpC(@requestBody() data: AuthCheckOtpDto) {
    this.logger.info("call checkOtpC()");
    const message = await this.authService.checkOtpS(data);
    // return authDto
    return this.response(message, HttpStatus.Created);
  }
  @httpPost("/refresh-token", ValidationMiddleware.validateInput(TokenDto))
  public async refreshTokens(@requestBody() token: TokenDto) {
    this.logger.info("call refreshTokons()");
    const message = await this.authService.refreshTokensS(token);
    //return new access token
    return this.response(message, HttpStatus.Created);
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
