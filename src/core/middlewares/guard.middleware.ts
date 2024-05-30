import passport from "passport";
import { BadRequestError, UnauthorizedError, jwtExpiredErr } from "../app/app.errors";
import { NextFunction, Request, Response } from "express";
import { OAuthProvider } from "../../common";
import { UsersEntity } from "../../models";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

class Guard {
  private static instance: Guard;
  private constructor() {}

  static get(): Guard {
    if (!Guard.instance) {
      Guard.instance = new Guard();
    }
    return Guard.instance;
  }
  /**
   * callback function to handle authentication based on the oauth flow
   * @param req
   * @param _res
   * @param next
   */
  public handleOauth =
    (req: Request, _res: Response, next: NextFunction) =>
    async (err: Error, user: UsersEntity): Promise<void> => {
      if (err || !user) {
        return next(new UnauthorizedError("User not authorized"));
      }
      req.user = user;
      next();
    };
  /**
   * callback function to handle authentication based on the sent jwt token to the endpoint
   * @param req
   * @param _res
   * @param next
   */
  public handleJwt =
    (req: Request, _res: Response, next: NextFunction) =>
    async (err: Error, user: UsersEntity, info: string | object | JsonWebTokenError | TokenExpiredError): Promise<void> => {
      if (err) {
        return next(new UnauthorizedError("Authentication failed"));
      }
      if (info instanceof TokenExpiredError) {
        return next(new jwtExpiredErr([`${info.expiredAt}`]));
      }
      if (info instanceof JsonWebTokenError) {
        return next(new BadRequestError(info.message));
      }
      if (info) {
        return next(new UnauthorizedError("Authentication failed"));
      }
      if (!user) {
        return next(new UnauthorizedError("user not Authenticated."));
      }

      req.user = user;
      next();
    };

  public oAuth = (serivce: OAuthProvider) => passport.authenticate(serivce, { session: false });
  public oAuthCallback = (service: OAuthProvider) => (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(service, { session: false }, this.handleOauth(req, res, next))(req, res, next);
  };

  public authJwt = () => async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, this.handleJwt(req, res, next))(req, res, next);
  };
}

const instance = Guard.get();

export { instance as Guard };
