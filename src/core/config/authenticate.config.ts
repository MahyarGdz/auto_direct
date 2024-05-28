import passport from "passport";
import { Strategy as FacebookStrategy, StrategyOptions } from "passport-facebook";
import { inject, injectable } from "inversify";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptionsWithoutRequest } from "passport-jwt";
import { IOCTYPES } from "../../IOC/ioc.types";
import { IAuthService } from "../../modules/auth/interfaces/IAuthService";

@injectable()
class Authenticate {
  @inject(IOCTYPES.AuthService) private authService: IAuthService;

  private jwtOptions: StrategyOptionsWithoutRequest = {
    secretOrKey: process.env.JWT_SECRET || "",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };
  private fbOptions: StrategyOptions = {
    clientID: process.env.FB_CLIENT_ID || "",
    clientSecret: process.env.FB_CLIENT_SEC || "",
    callbackURL: process.env.FB_CALLBACK || "",
    scope: ["email", "public_profile", "instagram_basic"],
    profileFields: ["id", "link", "email", "name", "picture", "address"],
    graphAPIVersion: "v19.0",
  };
  public initialize = () => {
    return passport.initialize();
  };

  public plug = (): void => {
    passport.use("jwt", new JwtStrategy(this.jwtOptions, this.authService.jwt));
    passport.use("facebook", new FacebookStrategy(this.fbOptions, this.authService.oAuth));
  };
}

export { Authenticate };
