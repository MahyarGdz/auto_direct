import { VerifiedCallback } from "passport-jwt";
import { AuthMessage, AuthTokenPayload } from "../../../common";
import { UsersEntity } from "../../../models";
import { AuthCheckOtpDto, AuthLoginDto, TokenDto } from "../dto";
import { Profile } from "passport-facebook";

type LoginResponse = {
  message: string;
  phone: string;
};

type CheckOtpResponse = {
  message: AuthMessage;
  accessToken: {
    token: string;
    expires: string;
  };
  refreshToken: {
    token: string;
    expires: string;
  };
  userInfo: UsersEntity;
};

type RefreshTokensResponse = {
  accessToken: {
    token: string;
    expires: string;
  };
  refreshToken: {
    token: string;
    expires: string;
  };
};

export interface IAuthService {
  loginS(data: AuthLoginDto): Promise<LoginResponse>;
  checkOtpS(data: AuthCheckOtpDto): Promise<CheckOtpResponse>;
  saveOtpCodeInCache(otpCode: string, phone: string): Promise<void>;
  refreshTokensS(d: TokenDto): Promise<RefreshTokensResponse>;
  generateOtpCode(): string;
  jwt(py: AuthTokenPayload, cb: VerifiedCallback): Promise<void>;
  oAuth(token: string, refreshToken: string, profile: Profile, cb: VerifiedCallback): Promise<void>;
}
