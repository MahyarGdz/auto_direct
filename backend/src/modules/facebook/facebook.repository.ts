import { Repository } from "typeorm";
import { appDataSrc } from "../../core";
import { FBTokensEntity } from "../../models";

class FBTokenRepository extends Repository<FBTokensEntity> {
  constructor() {
    super(FBTokensEntity, appDataSrc.manager);
  }
}
function createFBTokenRepository(): FBTokenRepository {
  return new FBTokenRepository();
}

export { FBTokenRepository, createFBTokenRepository };
