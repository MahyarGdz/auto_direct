import { UsersEntity } from "../../models";
import { UserRepository } from ".";

class UserService {
  constructor(private readonly UserRepository: UserRepository) {}

  async findUserByPhone(phone: string): Promise<UsersEntity | null> {
    const user = await this.UserRepository.findOne({ where: { phone: phone } });
    return user;
  }
}

export default UserService;
