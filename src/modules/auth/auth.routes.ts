import express, { Router } from "express";
import { asyncWrapper, logger } from "../../core";
import { AuthController } from "./auth.contoller";
import { UserService } from "../users/user.service";
import UserRepository from "../users/user.repository";
import { UsersEntity } from "../../models";
import { ValidatorMiddlewares } from "../../middlewares";
import { AuthLoginDto } from "./dto/authLogin.dto";

const router: Router = express.Router();

const userRepo = new UserRepository(UsersEntity);
const userService = new UserService(userRepo);
const authController = new AuthController(userService, logger);

router.post("/login", ValidatorMiddlewares(AuthLoginDto), asyncWrapper(authController.LoginC.bind(authController)));

// router.get("/test", asyncWrapper(authController.test.bind(authController)));

export default router;
