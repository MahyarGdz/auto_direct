import { controller } from "inversify-express-utils";

@controller("/users")
class UserController {}

export { UserController };
