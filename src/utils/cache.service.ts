import NodeCache from "node-cache";

function createNodeCache(): CacheService {
  return new CacheService();
}

class CacheService extends NodeCache {}

export { CacheService, createNodeCache };
