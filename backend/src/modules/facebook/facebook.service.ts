import { injectable } from "inversify";
import { IFacebookService, facebookPageData } from "./interfaces/IFacebook";
import { UsersEntity } from "../../models";
import axios from "axios";

@injectable()
class FacebookService implements IFacebookService {
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
}

export { FacebookService };
