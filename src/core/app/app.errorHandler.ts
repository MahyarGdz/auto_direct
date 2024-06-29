import { Request, Response, NextFunction } from "express";
import { ApiError, NotFoundError } from "./app.errors";
import { Logger } from "../logging/logger";
import { HttpStatus, IErrorResponse, ResponseFactory } from "../../common";
import { AxiosError } from "axios";
import { log } from "console";

const logger = new Logger();
// eslint-disable-next-line no-unused-vars
export function notFoundHandler(_req: Request, _res: Response, _next: NextFunction): void {
  const msg = "The endpoint you are trying to reach does not exist!";
  throw new NotFoundError(msg);
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error(`[${req.ip}] - ${req.method} ${req.path} - ${res.statusCode}`, { ...err, stack: err.stack });
  if (err instanceof AxiosError) log(err.cause, err.code, err.message);
  const errCode: HttpStatus = err instanceof ApiError ? err.code : 500;
  const errMsg = err instanceof ApiError ? err.message : "Something went wrong. Please try again later.";
  const errDetails = err instanceof ApiError ? err.details : [];
  const errResponse: IErrorResponse = ResponseFactory.errorResponse(errCode, errMsg, errDetails);

  res.status(errCode).json(errResponse);
}
// eslint-disable-next-line no-unused-vars
export function lastHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error(`Last error catcher: ${err.message}`);
  const errResponse: IErrorResponse = ResponseFactory.errorResponse(500, "Something went wrong. Please try again later");
  res.status(500).json(errResponse);
}
