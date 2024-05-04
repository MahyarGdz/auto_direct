import { Request } from "express";
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallbackWithRequest, StrategyOptionsWithRequest } from "passport-jwt";
import { AuthTokenPayload } from "../../common";
import { UserRepository } from "../../modules/users/user.repository";
import { Logger } from "../logging/logger";

const logger = new Logger();
const userRepository = new UserRepository();

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
    done(null, user);
  } catch (error) {
    logger.error(error);
    done(error, false);
  }
};
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerifyCallback);

export { jwtStrategy };
