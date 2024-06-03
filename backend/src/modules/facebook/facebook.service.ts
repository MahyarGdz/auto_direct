import { inject, injectable } from "inversify";
import { IFacebookService, facebookPageData, setPageData } from "./interfaces/IFacebook";
import { FBTokensEntity, UsersEntity } from "../../models";
import axios from "axios";
import { IOCTYPES } from "../../IOC/ioc.types";
import { FBTokenRepository } from "./facebook.repository";
import { BadRequestError } from "../../core";

@injectable()
class FacebookService implements IFacebookService {
  @inject(IOCTYPES.FBTokenRepository) private FBTokenRepository: FBTokenRepository;

  private FbGraphUrl: string = "https://graph.facebook.com";
  private FbGraphVersion: string = "v20.0";

  public async getPages(user: UsersEntity) {
    const FB_Access_Token = user.FBAccessToken;
    const FB_ID = user.facebookId;
    const url = `${this.FbGraphUrl}/${this.FbGraphVersion}/${FB_ID}/accounts`;

    const response = await axios.get(url, {
      params: {
        access_token: FB_Access_Token,
        fields: "access_token,category,name,id,photos{picture}",
      },
    });
    const pageData = (response.data as facebookPageData).data.map((page) => {
      return {
        id: page.id,
        name: page.name,
        category: page.category,
        photoUrl: page.photos.data[0].picture,
      };
    });

    return pageData;
  }

  public async setPage(user: UsersEntity, pageId: string): Promise<FBTokensEntity> {
    const FB_Access_Token = user.FBAccessToken;
    const url = `${this.FbGraphUrl}/${this.FbGraphVersion}/${pageId}`;

    const response = await axios.get(url, {
      params: {
        access_token: FB_Access_Token,
        fields: "access_token",
      },
    });
    if (Reflect.has(response.data, "error")) throw new BadRequestError("Please enter valid page id");
    /* Example : 
     {
      "error": {
        "message": "Unsupported get request. Object with ID '35847060n0674702' does not exist, cannot be loaded due to missing permissions, or does not support this operation. Please read the Graph API documentation at https://developers.facebook.com/docs/graph-api",
        "type": "GraphMethodException",
        "code": 100,
        "error_subcode": 33,
        "fbtrace_id": "AmigoGvN3gQJbR07IYJZvAa"
      }
    }
   */
    const PageData = response.data as setPageData;

    const { access_token, id } = PageData;
    const FbToken = this.FBTokenRepository.create({
      user: user,
      Page_Id: id,
      Page_AccessToken: access_token,
      Page_AccessTokenExpires: "null",
    });
    await this.FBTokenRepository.save(FbToken);
    return FbToken;
  }
}

export { FacebookService };
