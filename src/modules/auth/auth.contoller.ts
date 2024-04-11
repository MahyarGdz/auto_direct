import { Response, Request } from "express";
import { UserService } from "../users/user.service";
import { Logger } from "winston";
import { AuthLoginDto } from "./dto/authLogin.dto";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  //   async test(_req: Request, res: Response) {
  //     this.logger.info("calling test()");
  //     const msg = await this.userService.test();
  //     res.json({ msg });
  //   }

  async LoginC( req: Request, res: Response,) {

    this.logger.info("call LoginC()");

    const authDto: AuthLoginDto = req.body

     res.json(authDto)
    // return authDto
  }
}
