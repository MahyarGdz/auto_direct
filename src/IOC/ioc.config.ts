import { AsyncContainerModule } from "inversify";
import { Logger, Authenticate } from "../core";
import { IOCTYPES } from "./ioc.types";
import { ILogger, ITokenService } from "../common";
import { AuthController } from "../modules/auth/auth.controller";
import { IAuthController } from "../modules/auth/interfaces/IAuthController";
import { IAuthService } from "../modules/auth/interfaces/IAuthService";
import { AuthService } from "../modules/auth/auth.service";
import { AppRouter } from "../core/app/app.router";
import { TokenService } from "../utils";
import { IUserService } from "../modules/users/interfaces/IUserService";
import { UserService } from "../modules/users/user.service";
import { UserController } from "../modules/users/user.contoller";
import { IUserController } from "../modules/users/interfaces/IUserController";
import { UserRepository, createUserRepository } from "../modules/users/user.repository";
import { CacheService, createNodeCache } from "../utils/cache.service";

const containerModules = new AsyncContainerModule(async (bind) => {
  bind(AppRouter).to(AppRouter);
  bind(Authenticate).to(Authenticate);

  //controller
  bind<IAuthController>(IOCTYPES.AuthController).to(AuthController);
  bind<IUserController>(IOCTYPES.UserController).to(UserController);

  //services
  bind<IAuthService>(IOCTYPES.AuthService).to(AuthService);
  bind<ITokenService>(IOCTYPES.TokenService).to(TokenService);
  bind<ILogger>(IOCTYPES.Logger).to(Logger);
  bind<IUserService>(IOCTYPES.UserService).to(UserService);
  bind<CacheService>(IOCTYPES.CacheService).toDynamicValue(createNodeCache);

  //repositories
  bind<UserRepository>(IOCTYPES.UserRepository).toDynamicValue(createUserRepository);
});

export { containerModules };
