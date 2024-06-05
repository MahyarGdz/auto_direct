import { IsMobilePhone, IsNotEmpty, IsString } from "class-validator";

export class AuthLoginDto {
  @IsNotEmpty()
  @IsString()
  @IsMobilePhone("fa-IR")
  phone: string;
}
