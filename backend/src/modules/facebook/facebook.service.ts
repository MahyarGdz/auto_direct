import { inject, injectable } from "inversify";
import { IFacebookService, InstagramBusinessAccountData, facebookPageData, getMediaData, setPageData } from "./interfaces/IFacebook";
import { UsersEntity } from "../../models";
import axios from "axios";
import { IOCTYPES } from "../../IOC/ioc.types";
import { FBPagesRepository } from "./facebook.repository";
import { ForbiddenError, NotFoundError } from "../../core";
// import { BadRequestError } from "../../core";
// import { error } from "console";

@injectable()
class FacebookService implements IFacebookService {
  @inject(IOCTYPES.FBPagesRepository) private FBPagesRepository: FBPagesRepository;

  private FbGraphUrl: string = "https://graph.facebook.com";
  private FbGraphVersion: string = "v20.0";
  /**
   *
   * @param user
   * @returns
   */
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
  /**
   *
   * @param user
   * @param pageId
   * @returns
   */
  public async setPage(user: UsersEntity, pageId: string): Promise<{ message: string }> {
    const FB_Access_Token = user.FBAccessToken;
    const url = `${this.FbGraphUrl}/${this.FbGraphVersion}/${pageId}`;

    const response = await axios.get(url, {
      params: {
        access_token: FB_Access_Token,
        fields: "access_token,name,photos{picture}",
      },
    });

    const PageData = response.data as setPageData;

    const FbPage = await this.FBPagesRepository.findOne({ where: { Page_Id: pageId } });

    if (FbPage) throw new ForbiddenError("the page with this id has been set before.");

    const { access_token, id, name, photos } = PageData;
    const FbToken = this.FBPagesRepository.create({
      user: user,
      name: name,
      Page_Id: id,
      Page_AccessToken: access_token,
      photo_url: photos.data[0].picture,
    });

    await this.FBPagesRepository.save(FbToken);
    return { message: "The page has been set successfully" };
  }

  /**
   *
   * @param FB_pageId
   * @param pageAccessToken
   * @returns
   */
  async getInstagramBusinessAccount(FB_pageId: string, pageAccessToken: string): Promise<InstagramBusinessAccountData> {
    const url = `${this.FbGraphUrl}/${this.FbGraphVersion}/${FB_pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`;
    const response = await axios.get(url);
    const result = response.data as InstagramBusinessAccountData;
    return result;
  }
  /**
   *
   * @param user
   * @param pageID
   * @returns
   */
  async getMedia(user: UsersEntity, pageID: string) {
    const FBToken = await this.FBPagesRepository.findOne({ where: { Page_Id: pageID }, relations: { user: true } });

    if (!FBToken || FBToken.user.id !== user.id) {
      throw new NotFoundError("page not found !");
    }

    const IBAccount = await this.getInstagramBusinessAccount(FBToken.Page_Id, FBToken.Page_AccessToken);

    const url = `${this.FbGraphUrl}/${this.FbGraphVersion}/${IBAccount.instagram_business_account.id}/media`;
    const response = await axios.get(url, {
      params: {
        fields: "like_count,media_url,media_type,timestamp,thumbnail_url,shortcode,comments_count",
        access_token: FBToken.Page_AccessToken,
      },
    });
    const result = response.data as getMediaData;

    return result;
  }
  /**
   *
   * @param user
   * @returns
   */
  async getSetedPages(user: UsersEntity) {
    const pages = await this.FBPagesRepository.find({
      where: { user: { id: user.id } },
      select: { name: true, photo_url: true, Page_Id: true, createdAt: true, updatedAt: true },
      //   relations: { user: true },
    });
    if (pages.length <= 0) throw new NotFoundError("the seted page not found");
    return pages;
  }
}

export { FacebookService };

// async function getConversations(instagramBusinessAccountId, accessToken) {
//   const url = `https://graph.facebook.com/v9.0/${instagramBusinessAccountId}/conversations?platform=instagram&access_token=${accessToken}`;
//   const response = await axios.get(url);
//   return response.data;
// }
