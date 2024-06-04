import { UsersEntity } from "../../../models";

export interface facebookPageData {
  data: Array<{
    access_token: string;
    category: string;
    name: string;
    id: string;
    photos: {
      data: Array<{
        picture: string;
        id: string;
      }>;
      paging: { cursors: { before: string; after: string } };
    };
  }>;
  paging: { cursors: { before: string; after: string } };
}
export interface returnPageData {
  id: string;
  name: string;
  category: string;
  photoUrl: string;
}

export interface setPageData {
  access_token: string;
  name:string,
  id: string;
}

export interface InstagramBusinessAccountData {
  instagram_business_account: {
    id: string;
  };
  id: string;
}

export interface getMediaData {
  data: [
    {
      like_count: number;
      media_url: string;
      media_type: string;
      timestamp: string;
      shortcode: string;
      comments_count: number;
      id: string;
    },
  ];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
  };
}
export interface IFacebookService {
  getPages(user: UsersEntity): Promise<returnPageData[]>;
  setPage(user: UsersEntity, pageId: string): Promise<{ message: string }>;
  getInstagramBusinessAccount(FB_pageId: string, pageAccessToken: string): Promise<InstagramBusinessAccountData>;
  getMedia(user: UsersEntity, pageID: string): Promise<getMediaData>;
}
