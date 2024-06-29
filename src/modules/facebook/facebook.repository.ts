import { Repository } from "typeorm";
import { appDataSrc } from "../../core";
import { FBPagesEntity } from "../../models";

class FBPagesRepository extends Repository<FBPagesEntity> {
  constructor() {
    super(FBPagesEntity, appDataSrc.manager);
  }
}
function createFBPagesRepository(): FBPagesRepository {
  return new FBPagesRepository();
}

export { FBPagesRepository, createFBPagesRepository };
