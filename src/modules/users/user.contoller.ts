import { injectable } from "inversify";
import { IUserController } from "./interfaces/IUserController";
@injectable()
class UserController implements IUserController {}

export { UserController };
