import { Request, Response, NextFunction } from "express";

export const asyncWrapper = (controller: CallableFunction) => async (req: Request, res: Response, next: NextFunction) => {
  //   Promise.resolve(controller(req, res, next)).catch(next);
  try {
    await controller(req, res, next);
  } catch (error) {
    next(error);
  }
};
