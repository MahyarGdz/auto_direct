import { BaseHttpController } from "inversify-express-utils";
import { HttpStatus } from "../enums/httpStatus.enum";
import { ResponseFactory } from "../factories/response.factory";

class Controller extends BaseHttpController {
  protected response(data: Record<string, unknown>, status: HttpStatus) {
    const response = ResponseFactory.successResponse(status, data);

    return this.json(response, status);
  }
}

export { Controller };
