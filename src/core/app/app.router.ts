import { inject, injectable } from "inversify";
import { IOCTYPES } from "../../IOC/ioc.types";
import { asyncWrapper } from "../../utils";
import { IAuthController } from "../../modules/auth/interfaces/IAuthController";
import { Application } from "express";
import { ValidatorMiddlewares, auth } from "..";
import { AuthCheckOtpDto, AuthLoginDto, TokenDto } from "../../modules/auth/dto";

interface BaseController {
  [key: string]: any;
}
@injectable()
export class AppRouter {
  @inject(IOCTYPES.AuthController) private authController: IAuthController;

  private getController(context: BaseController, func: string) {
    console.log(this.authController);

    return asyncWrapper(context[func]);
  }

  public initRoutes(app: Application) {
    app.post("/api/auth/login", ValidatorMiddlewares(AuthLoginDto), this.getController(this.authController, "loginC"));
    app.post("/auth/check-otp", ValidatorMiddlewares(AuthCheckOtpDto), this.getController(this.authController, "checkOtpC"));
    app.post("/auht/refresh-token", ValidatorMiddlewares(TokenDto), this.getController(this.authController, "refreshTokens"));
    app.get("/auth/secret-path", auth(), async (req, res) => {
      const { user } = req;
      return res.json({ user });
    });
  }
}
