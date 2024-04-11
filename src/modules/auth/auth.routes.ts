import express, { Router } from "express";
import { asyncWrapper, logger } from "../../core";
import { AuthController } from "./auth.contoller";
import { UserService } from "../users/user.service";
import UserRepository from "../users/user.repository";
import { UsersEntity } from "../../models";

const router: Router = express.Router();

const userRepo = new UserRepository(UsersEntity);
const userService = new UserService(userRepo);
const authController = new AuthController(userService, logger);

// router.post("/login");
router.get("/test", asyncWrapper(authController.test.bind(authController)));

export default router;
