import { useEffect, useState } from 'react';

import createCacheProvider from './cache-factory';

import type { CacheProviderResult, Config } from './types';

export default useCacheProvider;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCacheProvider<Data = any, Error = any>(
  props: Config,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map: Map<any, any>,
): CacheProviderResult<Data> | undefined {
  const [cache, setCache] = useState<CacheProviderResult<Data>>();

  useEffect(() => {
    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      const result = await createCacheProvider<Data, Error>(props, map);
      if (!active) {
        return;
      }
      setCache(result);
    }
  }, []);

  return cache;
}
