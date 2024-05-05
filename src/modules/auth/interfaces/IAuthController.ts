import { Request, Response } from "express";

export interface IAuthController {
  loginC: (req: Request, res: Response) => Promise<void>;
  checkOtpC: (req: Request, res: Response) => Promise<void>;
  refreshTokens: (req: Request, res: Response) => Promise<void>;
}
