import { controller, httpGet, httpPost, request, requestBody, requestParam } from "inversify-express-utils";
import { Request } from "express";
import { Controller, HttpStatus } from "../../common";
import { Guard, ValidationMiddleware } from "../../core";
import { UsersEntity } from "../../models";
import { IOCTYPES } from "../../IOC/ioc.types";
import { IFacebookService } from "./interfaces/IFacebook";
import { inject } from "inversify";
import { setPageDataDTO } from "./dto/setPageData.dto";

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

  @httpPost("/setPage", Guard.authJwt(), ValidationMiddleware.validateInput(setPageDataDTO))
  public async setPage(@request() req: Request, @requestBody() pageData: setPageDataDTO) {
    const user = req.user as UsersEntity;
    const { pageID } = pageData;
    const message = await this.facebookService.setPage(user, pageID);
    //return { message : "The page has been set successfully" }
    return this.response({ message }, HttpStatus.Ok);
  }

  @httpGet("/:pageID/getMedia", Guard.authJwt())
  public async getMedia(@request() req: Request, @requestParam("pageID") pageID: string) {
    const user = req.user as UsersEntity;
    const pageMedia = await this.facebookService.getMedia(user, pageID);
    //return
    return this.response({ ...pageMedia }, HttpStatus.Ok);
  }

  @httpGet("/setedPages", Guard.authJwt())
  public async getSetedPages(@request() req: Request) {
    const user = req.user as UsersEntity;
    const data = await this.facebookService.getSetedPages(user);
    //return
    return this.response({ data }, HttpStatus.Ok);
  }
}

export { FacebookController };
