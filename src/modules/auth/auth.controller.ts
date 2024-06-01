import { Response, Request, NextFunction } from "express";
import { controller, httpGet, httpPost, next, request, requestBody, response } from "inversify-express-utils";
import { inject } from "inversify";

import { AuthLoginDto, AuthCheckOtpDto, TokenDto } from "./dto";
import { IOCTYPES } from "../../IOC/ioc.types";
import { Controller, HttpStatus } from "../../common";
import { IAuthService } from "./interfaces/IAuthService";
import { ValidationMiddleware, Guard, ILogger } from "../../core";
import { UsersEntity } from "../../models";

@controller("/auth")
class AuthController extends Controller {
  @inject(IOCTYPES.AuthService) private authService: IAuthService;
  @inject(IOCTYPES.Logger) private logger: ILogger;

  @httpPost("/login", ValidationMiddleware.validateInput(AuthLoginDto))
  public async loginC(@requestBody() LoginData: AuthLoginDto) {
    this.logger.info("call loginC()");
    const message = await this.authService.loginS(LoginData);
    // return authDto
    return this.response(message);
  }

  @httpPost("/check-otp", ValidationMiddleware.validateInput(AuthCheckOtpDto))
  public async checkOtpC(@requestBody() data: AuthCheckOtpDto) {
    this.logger.info("call checkOtpC()");
    const tokens = await this.authService.checkOtpS(data);
    // return authDto
    return this.response(tokens, HttpStatus.Created);
  }

  @httpPost("/refresh-token", ValidationMiddleware.validateInput(TokenDto))
  public async refreshTokens(@requestBody() refreshToken: TokenDto) {
    this.logger.info("call refreshTokons()");
    const tokens = await this.authService.refreshTokensS(refreshToken);
    //return new access token
    return this.response(tokens, HttpStatus.Created);
  }

  @httpGet("/secret", Guard.authJwt())
  public async testSecret(@request() req: Request, @response() res: Response) {
    const { user } = req;
    res.json({ user });
  }

  @httpGet("/facebookNew", Guard.authJwt())
  public async connectFbAccount(@request() req: Request, @response() res: Response, @next() nxt: NextFunction) {
    this.logger.info("call connectFbAccount()");
    const user = req.user as UsersEntity;
    Guard.oAuth("facebook", user.id)(req, res, nxt);
  }
  //
  @httpGet("/facebook/callback", Guard.oAuthCallback("facebook"))
  public async fbCallback(@request() req: Request, @response() res: Response) {
    res.json({ user: req.user });
  }
}

export { AuthController };
