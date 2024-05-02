import express, { Router } from "express";
import NodeCache from "node-cache";
import { asyncWrapper, Logger } from "../../core";
import { AuthController } from "./auth.contoller";
import { AuthService } from "./auth.service";
import { AuthLoginDto, AuthCheckOtpDto, TokenDto } from "./dto";
import { UserService, UserRepository } from "../users";
import { UsersEntity } from "../../models";
import { ValidatorMiddlewares, auth } from "../../core";

const router: Router = express.Router();

const logger = new Logger();
const userRepo = new UserRepository(UsersEntity);
const cache = new NodeCache();
const userService = new UserService(userRepo);
const authService = new AuthService(userService, cache, userRepo);
const authController = new AuthController(authService, logger);

router.post("/auth/login", ValidatorMiddlewares(AuthLoginDto), asyncWrapper(authController.LoginC));
router.post("/auth/check-otp", ValidatorMiddlewares(AuthCheckOtpDto), asyncWrapper(authController.checkOtpC));
router.post("/auht/refresh-token", ValidatorMiddlewares(TokenDto), asyncWrapper(authController.refreshTokens));
router.get("/auth/secret-path", auth(), async (req, res) => {
  const { user } = req;
  return res.json({ user });
});
export default router;
