import { IsNotEmpty, IsString } from "class-validator";

export class setPageDataDTO {
  @IsNotEmpty()
  @IsString()
  pageID: string;
}
