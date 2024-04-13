import passport from "passport";
import { UnauthorizedError } from "../common/error/app.error";
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

const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await new Promise((resolve, reject) => {
      passport.authenticate("jwt", { session: false }, checkCallback(req, resolve, reject))(req, res, next);
    });
    next();
  } catch (error) {
    next(error);
  }
};

export { auth };
