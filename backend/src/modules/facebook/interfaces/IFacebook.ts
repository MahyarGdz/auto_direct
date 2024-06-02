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
export interface IFacebookService {
  getPages(user: UsersEntity): Promise<returnPageData[]>;
}