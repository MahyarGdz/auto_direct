import passport from "passport";
import { Strategy as FacebookStrategy, StrategyOptionsWithRequest } from "passport-facebook";
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
  private fbOptions: StrategyOptionsWithRequest = {
    clientID: process.env.FB_CLIENT_ID || "",
    clientSecret: process.env.FB_CLIENT_SEC || "",
    callbackURL: process.env.FB_CALLBACK || "",
    scope: [
      "email",
      "public_profile",
      "instagram_basic",
      "instagram_manage_comments",
      "instagram_manage_messages",
      "pages_show_list",
      "pages_read_engagement",
      "business_management",
      "pages_manage_metadata",
      "pages_messaging",
    ],
    profileFields: ["id", "email", "displayName", "picture"],
    graphAPIVersion: "v20.0",
    passReqToCallback: true,
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
