import { Response, Request } from "express";
import { Logger } from "winston";
import { AuthService, AuthLoginDto, AuthCheckOtpDto, TokenDto } from ".";

class AuthController {
  constructor(
    private readonly authService: AuthService,
    private logger: Logger,
  ) {}

  public LoginC = async (req: Request, res: Response) => {
    this.logger.info("call LoginC()");
    const authDto: AuthLoginDto = req.body;
    const message = await this.authService.LoginS(authDto);
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

export default AuthController;
