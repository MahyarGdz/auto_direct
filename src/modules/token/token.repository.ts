import { Repository } from "typeorm";
import { appDataSrc } from "../../core";
import { RefTokensEntity } from "../../models/RefTokens.model";

class TokenRepository extends Repository<RefTokensEntity> {
  constructor() {
    super(RefTokensEntity, appDataSrc.manager);
  }
}
function createTokenRepository(): TokenRepository {
  return new TokenRepository();
}

export { TokenRepository, createTokenRepository };
