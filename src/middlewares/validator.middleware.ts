import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../common/error/app.error";

const ValidatorMiddlewares = (validationSchema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ---- get Body ----------

      const body = req.body;

      const validationClass = plainToInstance(validationSchema, body);

      // ------ validation -------------
      const errors: ValidationError[] = await validate(validationClass, {});

      if (errors.length > 0) {
        const errorMsg = errors.map((error) => Object.values(error.constraints!)).flat();
        throw new BadRequestError("bad Request", errorMsg);
        // res.status(400).send({ errors: errors });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  };
};

export default ValidatorMiddlewares;
