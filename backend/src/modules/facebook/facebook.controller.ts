import { controller, httpGet, request } from "inversify-express-utils";
import { Request } from "express";
import { Controller } from "../../common";
import { Guard } from "../../core";
import { UsersEntity } from "../../models";
import { IOCTYPES } from "../../IOC/ioc.types";
import { IFacebookService } from "./interfaces/IFacebook";
import { inject } from "inversify";

@controller("/facebook")
class FacebookController extends Controller {
  @inject(IOCTYPES.FacebookService) facebookService: IFacebookService;

  @httpGet("/getPages", Guard.authJwt())
  public async getPage(@request() req: Request) {
    const user = req.user as UsersEntity;
    const pages = await this.facebookService.getPages(user);
    //return pages
    return this.response({ pages });
  }
}

export { FacebookController };
