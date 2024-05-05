import NodeCache from "node-cache";

function createNodeCache(): NodeCache {
  return new NodeCache();
}

class CacheService extends NodeCache {}

export { CacheService, createNodeCache };
