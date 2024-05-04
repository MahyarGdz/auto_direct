import { Container } from "inversify";
import { Logger } from "../core";
import { IOCTYPES } from "./ioc.types";
import { ILogger, ITokenService } from "../common";
import { AuthController } from "../modules/auth/auth.controller";
import { IAuthController } from "../modules/auth/interfaces/IAuthController";
import { IAuthService } from "../modules/auth/interfaces/IAuthService";
import { AuthService } from "../modules/auth/auth.service";
import { AppRouter } from "../core/app/app.router";
import { TokenService } from "../utils";

const container = new Container({ defaultScope: "Singleton" });

container.bind(AppRouter).to(AppRouter);

container.bind<IAuthController>(IOCTYPES.AuthController).to(AuthController);
container.bind<IAuthService>(IOCTYPES.AuthService).to(AuthService);
container.bind<ITokenService>(IOCTYPES.TokenService).to(TokenService);
container.bind<ILogger>(IOCTYPES.Logger).to(Logger);

export default container;
