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
import { IUserService } from "../modules/users/interfaces/IUserService";
import { UserService } from "../modules/users/user.service";
import { UserController } from "../modules/users/user.contoller";
import { IUserController } from "../modules/users/interfaces/IUserController";
import { UserRepository, createUserRepository } from "../modules/users/user.repository";
import { CacheService, createNodeCache } from "../utils/cache.service";

const container = new Container({ defaultScope: "Singleton" });

container.bind(AppRouter).to(AppRouter);

//controller
container.bind<IAuthController>(IOCTYPES.AuthController).to(AuthController);
container.bind<IUserController>(IOCTYPES.UserController).to(UserController);

//services
container.bind<IAuthService>(IOCTYPES.AuthService).to(AuthService);
container.bind<ITokenService>(IOCTYPES.TokenService).to(TokenService);
container.bind<ILogger>(IOCTYPES.Logger).to(Logger);
container.bind<IUserService>(IOCTYPES.UserService).to(UserService);
container.bind<CacheService>(IOCTYPES.CacheService).toDynamicValue(createNodeCache);

//repositories
container.bind<UserRepository>(IOCTYPES.UserRepository).toDynamicValue(createUserRepository);

export default container;
