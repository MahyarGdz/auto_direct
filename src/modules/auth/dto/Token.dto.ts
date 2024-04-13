import { IsJWT, IsNotEmpty, IsString } from "class-validator";

export class TokenDto {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  token: string;
}
