import { Request, Response, NextFunction } from "express";
import { ApiError, NotFoundError } from "../common/error/app.error";
import { logger } from "./logger";
import { IErrorResponse } from "../common/interfaces/IErrorResponse";

// eslint-disable-next-line no-unused-vars
export function notFoundHandler(_req: Request, _res: Response, _next: NextFunction): void {
  const msg = "The endpoint you are trying to reach does not exist!";
  throw new NotFoundError(msg);
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error(`${req.method} ${req.path} - ${err.stack}`);
  const errorResponse: IErrorResponse = {
    status: err instanceof ApiError ? err.code : 500,
    success: false,
    error: {
      message: err instanceof ApiError ? err.message : "Something went wrong. Please try again later.",
      details: err instanceof ApiError ? err.details : [],
    },
  };
  res.status(errorResponse.status).json(errorResponse);
}
// eslint-disable-next-line no-unused-vars
export function lastHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error(`Last error catcher: ${err.message}`);
  const errorResponse: IErrorResponse = {
    status: 500,
    success: false,
    error: {
      message: "Something went wrong. Please try again later.",
      details: [],
    },
  };
  res.status(500).json(errorResponse);
}
