import passport from "passport";
import { UnauthorizedError } from "../app/app.errors";
import { NextFunction, Request, Response } from "express";

const checkCallback = (req: Request, resolve: (value?: unknown) => void, reject: (error?: any) => void) => {
  return async (err: Error, user: any, info: any) => {
    if (err || info || !user) {
      return reject(new UnauthorizedError("User not authorized"));
    }
    req.user = user;
    resolve();
  };
};

const authJwt = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await new Promise((resolve, reject) => {
      passport.authenticate("jwt", { session: false }, checkCallback(req, resolve, reject))(req, res, next);
    });
    next();
  } catch (error) {
    next(error);
  }
};

const handleOauth =
  (req: Request, _res: Response, next: NextFunction) =>
  async (err: Error, user: any): Promise<void> => {
    if (err || !user) {
      return next(new UnauthorizedError("User not authorized"));
    }
    req.user = user;
    next();
  };

const oAuth = (serivce: string) => passport.authenticate(serivce, { session: false });

const oAuthCallback = (service: string) => (req: Request, res: Response, next: NextFunction) =>
  //   this.oAuthentify(req, res, next, service, this.handleOauth);
  passport.authenticate(service, { session: false }, handleOauth(req, res, next))(req, res, next);

export { authJwt, oAuth, oAuthCallback };
