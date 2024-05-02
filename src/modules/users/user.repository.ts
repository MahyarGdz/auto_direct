import { EntityTarget, Repository } from "typeorm";
import { UsersEntity } from "../../models";
import { appDataSrc } from "../../core/app/app.datasource";

class UserRepository extends Repository<UsersEntity> {
  constructor(target: EntityTarget<UsersEntity>) {
    super(target, appDataSrc.manager);
  }
}

export default UserRepository;
