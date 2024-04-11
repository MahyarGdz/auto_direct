
import { EntityManager, EntityTarget, Repository } from "typeorm";
import { UsersEntity } from "../../models";

class UserRepository extends Repository<UsersEntity> {
  constructor(target: EntityTarget<UsersEntity>, manager: EntityManager) {
    super(target, manager);
  }
}

export default UserRepository;