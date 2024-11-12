import { ClassConstructor, plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { BadRequestError } from "../app/app.errors";
import { injectable } from "inversify";

@injectable()
export class ValidationMiddleware {
  static validateInput(DTO: ClassConstructor<any>): RequestHandler {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      try {
        const body = req.body;

        const validationClass = plainToInstance(DTO, body);

        // Validate DTO object
        const errors: ValidationError[] = await validate(validationClass, {});

        if (errors.length > 0) {
          const errorMsg = errors.map((error) => Object.values(error.constraints!)).flat();

          throw new BadRequestError("bad Request", errorMsg);
        } else {
          next();
        }
      } catch (error) {
        next(error);
      }
    };
  }
}
