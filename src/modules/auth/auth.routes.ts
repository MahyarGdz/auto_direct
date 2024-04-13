import express, { Router } from "express";
import NodeCache from "node-cache";
import { asyncWrapper, logger } from "../../core";
import { AuthController, AuthService, AuthLoginDto, AuthCheckOtpDto, TokenDto } from "./";
import { UserService, UserRepository } from "../users";
import { UsersEntity } from "../../models";
import { ValidatorMiddlewares, auth } from "../../middlewares";

const router: Router = express.Router();

const userRepo = new UserRepository(UsersEntity);
const cache = new NodeCache();
const userService = new UserService(userRepo);
const authService = new AuthService(userService, cache, userRepo);
const authController = new AuthController(authService, logger);

router.post("/login", ValidatorMiddlewares(AuthLoginDto), asyncWrapper(authController.LoginC));
router.post("/check-otp", ValidatorMiddlewares(AuthCheckOtpDto), asyncWrapper(authController.checkOtpC));
router.post("/refresh-token", ValidatorMiddlewares(TokenDto), asyncWrapper(authController.refreshTokens));
router.get("/secret-path", auth(), async (req, res) => {
  const { user } = req;
  return res.json({ user });
});
export default router;
