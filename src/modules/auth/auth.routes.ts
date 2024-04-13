import express, { Router } from "express";
import NodeCache from "node-cache";
import { asyncWrapper, logger } from "../../core";
import { AuthController, AuthService, AuthLoginDto, AuthCheckOtpDto } from "./";
import { UserService, UserRepository } from "../users";
import { UsersEntity } from "../../models";
import { ValidatorMiddlewares, auth } from "../../middlewares";

const router: Router = express.Router();

const userRepo = new UserRepository(UsersEntity);
const cache = new NodeCache();
const userService = new UserService(userRepo);
const authService = new AuthService(userService, cache, userRepo);
const authController = new AuthController(authService, logger);

router.post("/login", ValidatorMiddlewares(AuthLoginDto), asyncWrapper(authController.LoginC.bind(authController)));
router.post("/check-otp", ValidatorMiddlewares(AuthCheckOtpDto), asyncWrapper(authController.checkOtpC.bind(authController)));
router.get("/auth-test", auth(), async (req, res) => {
  console.log("heressss");
  const { user } = req;
  return res.json({ user, test: "tes" });
});
export default router;
