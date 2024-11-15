import { AsyncContainerModule } from "inversify";
import { Logger, Authenticate, ILogger } from "../core";
import { IOCTYPES } from "./ioc.types";
import { IAuthService } from "../modules/auth/interfaces/IAuthService";
import { AuthService } from "../modules/auth/auth.service";
import { IUserService } from "../modules/users/interfaces/IUserService";
import { UserService } from "../modules/users/user.service";

import { UserRepository, createUserRepository } from "../modules/users/user.repository";
import { CacheService, createNodeCache } from "../utils/cache.service";
import { TokenService } from "../modules/token/token.service";
import { TokenRepository, createTokenRepository } from "../modules/token/token.repository";
import { FacebookService } from "../modules/facebook/facebook.service";
import { IFacebookService } from "../modules/facebook/interfaces/IFacebook";
import { createFBPagesRepository, FBPagesRepository } from "../modules/facebook/facebook.repository";

const containerModules = new AsyncContainerModule(async (bind) => {
  bind(Authenticate).to(Authenticate);

  //services
  bind<IAuthService>(IOCTYPES.AuthService).to(AuthService);
  bind<IUserService>(IOCTYPES.UserService).to(UserService);
  bind<IFacebookService>(IOCTYPES.FacebookService).to(FacebookService);
  bind<TokenService>(IOCTYPES.TokenService).to(TokenService);
  bind<ILogger>(IOCTYPES.Logger).to(Logger);
  bind<CacheService>(IOCTYPES.CacheService).toDynamicValue(createNodeCache);

  //repositories
  bind<UserRepository>(IOCTYPES.UserRepository).toDynamicValue(createUserRepository);
  bind<TokenRepository>(IOCTYPES.TokenRepository).toDynamicValue(createTokenRepository);
  bind<FBPagesRepository>(IOCTYPES.FBPagesRepository).toDynamicValue(createFBPagesRepository);
});

export { containerModules };
