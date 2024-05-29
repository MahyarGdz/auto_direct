import { AsyncContainerModule } from "inversify";
import { Logger, Authenticate } from "../core";
import { IOCTYPES } from "./ioc.types";
import { ILogger, ITokenService } from "../common";
import { IAuthService } from "../modules/auth/interfaces/IAuthService";
import { AuthService } from "../modules/auth/auth.service";
import { TokenService } from "../utils";
import { IUserService } from "../modules/users/interfaces/IUserService";
import { UserService } from "../modules/users/user.service";

import { UserRepository, createUserRepository } from "../modules/users/user.repository";
import { CacheService, createNodeCache } from "../utils/cache.service";

const containerModules = new AsyncContainerModule(async (bind) => {
  bind(Authenticate).to(Authenticate);

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
