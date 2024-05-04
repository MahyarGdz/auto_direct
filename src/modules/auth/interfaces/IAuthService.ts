import { AuthMessage } from "../../../common";
import { UsersEntity } from "../../../models";
import { AuthCheckOtpDto, AuthLoginDto, TokenDto } from "../dto";

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
  refreshTokensS(data: TokenDto): Promise<RefreshTokensResponse>;
  generateOtpCode(): string;
}
