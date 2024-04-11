import { IsEnum, IsMobilePhone, IsNotEmpty, IsNumberString, IsString, Length } from "class-validator"


export class AuthCheckOtpDto {
    @IsNotEmpty()
    @IsString()
    @IsMobilePhone('fa-IR')
    phone:string
    @IsNotEmpty()
    @IsNumberString()
    @Length(5,5)
    otpCode:string
}