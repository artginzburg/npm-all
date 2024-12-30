import simpleStorageHandler from './simple';

import type { StorageHandler } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any;
type StoreObject = {
  value: Data;
  ts: number;
};

/**
 * Storage value handler that wraps value in object containing timestamp
 */
const timestampStorageHandler: StorageHandler<Data, StoreObject> = {
  ...simpleStorageHandler,

  /**
   * @inheritdoc
   */
  initialize(database, storeName) {
    const objectStore = database.createObjectStore(storeName);

    objectStore.createIndex('ts', 'ts');
  },

  /**
   * @inheritdoc
   */
  replace: (_key, value) => ({
    value,
    ts: Date.now(),
  }),

  /**
   * @inheritdoc
   */
  revive: (_key, storeObject) => storeObject.value,
} as const;

export default timestampStorageHandler;
