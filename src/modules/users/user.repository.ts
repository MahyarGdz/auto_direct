import { Repository } from "typeorm";
import { UsersEntity } from "../../models";
import { appDataSrc } from "../../core/app/app.datasource";

class UserRepository extends Repository<UsersEntity> {
  constructor() {
    super(UsersEntity, appDataSrc.manager);
  }
  public async findUserByPhone(phone: string): Promise<UsersEntity | null> {
    const user = await this.findOne({ where: { phone: phone } });
    return user;
  }
}
function createUserRepository(): UserRepository {
  return new UserRepository();
}

export { UserRepository, createUserRepository };
