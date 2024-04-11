import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";

const ValidatorMiddlewares = (validationSchema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    let errors: object[] = [];

    // ---- get Body ----------

    const body = req.body;

    const validationClass = plainToInstance(validationSchema, body);

    // ------ validation -------------

    validate(validationClass, {}).then((error: any) => {
        
      if (error.length > 0) {

        error.map((err: any) => {

          errors.push({ [err.property]: Object.values(err.constraints) });

        });

        res.status(400).send({errors:errors});

      }else{

        next()

      }
    });
  };
};

export default ValidatorMiddlewares;
