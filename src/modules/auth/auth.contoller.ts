import { Response, Request } from "express";
import { UserService } from "../users/user.service";
import { Logger } from "winston";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async test(_req: Request, res: Response) {
    this.logger.info("calling test()");
    const msg = await this.userService.test();
    res.json({ msg });
  }
}
