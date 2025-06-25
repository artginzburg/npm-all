import { openDB } from 'idb';
import { noop } from 'swr/_internal';

import simpleStorageHandler from './storage-handlers/simple';

import type { CacheProviderResult, Config } from './types';
import type { IDBPDatabase } from 'idb';
import type { State as SWRState } from 'swr';

/**
 * Unlike what SWR types suggest, key is always a serialized string
 *
 * @override import('swr').Key
 */
type Key = string;

/** Cache provider factory */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function createCacheProvider<Data = any, Error = any>(
  { dbName, storeName, storageHandler = simpleStorageHandler, version = 1, onError = noop }: Config,
  map: Map<Key, SWRState<Data, Error>>,
): Promise<CacheProviderResult<Data>> {
  type State = SWRState<Data, Error>;

  // Initialize storage snapshot
  // const map = new Map<Key, State>();

  // Initialize database
  let db: IDBPDatabase | undefined;

  try {
    db = await openDB(dbName, version, {
      upgrade(upgradeDb, oldVersion) {
        if (!oldVersion) {
          storageHandler.initialize(upgradeDb, storeName);
        } else {
          storageHandler.upgrade(upgradeDb, storeName, oldVersion);
        }
      },
    });

    // Get storage snapshot
    let cursor = await db.transaction(storeName, 'readwrite').store.openCursor();

    while (cursor) {
      const key = cursor.key as Key;
      const value = storageHandler.revive(key, cursor.value);

      // Stale
      if (value === undefined) {
        cursor.delete();
        // OK
      } else {
        map.set(key, value);
      }

      cursor = await cursor.continue();
    }
  } catch (error) {
    // Use fallback
    onError(error);
    return map;
  }

  /** SWR Cache provider API */
  return {
    keys: () => map.keys(),

    get: (key: Key): State | undefined => map.get(key),

    set: (key: Key, value: State): void => {
      map.set(key, value);

      if (isFetchInfo(value)) {
        return;
      }

      const storeValue = storageHandler.replace(key, value);

      if (storeValue === undefined) {
        return;
      }

      db?.put(storeName, storeValue, key).catch(onError);
    },

    delete: (key: Key): void => {
      if (map.delete(key)) {
        db?.delete(storeName, key).catch(onError);
      }
    },
    clear: (): void => {
      map.clear();
      db?.clear(storeName);
    },
  };

  /**
   * Do not store as non-native errors are not serializable, other properties are optional
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types
   */
  function isFetchInfo(state: State): boolean {
    return state.error instanceof Error || state.isValidating === true || state.isLoading === true;
  }
}
