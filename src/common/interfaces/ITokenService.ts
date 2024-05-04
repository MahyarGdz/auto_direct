import { SignOptions, JwtPayload } from "jsonwebtoken";
import { AuthTokenPayload, Token } from "../types/jwtToken.type";

type generatedAuthToken = {
  accessToken: {
    token: string;
    expires: string;
  };
  refreshToken: {
    token: string;
    expires: string;
  };
};

export interface ITokenService {
  _generateToken(payload: AuthTokenPayload, option: SignOptions): string;
  generateAuthTokens(payload: AuthTokenPayload): generatedAuthToken;
  verifyToken(token: Token): string | JwtPayload;
}
