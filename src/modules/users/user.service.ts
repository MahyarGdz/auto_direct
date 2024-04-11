import { NotFoundError } from "../../common/error/app.error";
import { UsersEntity } from "../../models";
import UserRepository from "./user.repository";

export class UserService {
  constructor(private readonly UserRepository: UserRepository) {}

  async findUserByPhone(phone: string): Promise<UsersEntity | null> {
    const user = await this.UserRepository.findOne({ where: { phone: phone } });
    if (!user) throw new NotFoundError("the user was not found by given phone");
    return user;
  }
  async test(): Promise<string> {
    return "test";
  }
}
