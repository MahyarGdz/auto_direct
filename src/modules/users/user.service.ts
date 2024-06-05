import { IUserService } from "./interfaces/IUserService";
import { injectable } from "inversify";

@injectable()
class UserService implements IUserService {}

export { UserService };
