import { Request } from "express";
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallbackWithRequest, StrategyOptionsWithRequest } from "passport-jwt";
import { AuthTokenPayload } from "../common/types";
import { UserRepository } from "../modules/users";
import { UsersEntity } from "../models";
import { logger } from "./logger";

const userRepository = new UserRepository(UsersEntity);

const jwtOptions: StrategyOptionsWithRequest = {
  secretOrKey: process.env.JWT_SECRET || "",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  passReqToCallback: true,
};
const jwtVerifyCallback: VerifyCallbackWithRequest = async (_req: Request, payload: AuthTokenPayload, done) => {
  try {
    const user = await userRepository.findOne({ where: { id: payload.sub } });
    if (!user) {
      return done(null, false);
    }
    console.log(payload);

    done(null, user);
  } catch (error) {
    logger.error(error);
    done(error, false);
  }
};
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerifyCallback);

export { jwtStrategy };
