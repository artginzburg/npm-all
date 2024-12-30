import type { StorageHandler } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any;
type StoreObject = Data;

/**
 * Simple storage handler
 */
const simpleStorageHandler: StorageHandler<Data, StoreObject> = {
  /**
   * @inheritdoc
   */
  initialize(database, storeName) {
    database.createObjectStore(storeName);
  },

  /**
   * @inheritdoc
   */
  upgrade(database, storeName) {
    database.deleteObjectStore(storeName);

    this.initialize(database, storeName);
  },

  /**
   * @inheritdoc
   */
  replace: (_key, value) => value,

  /**
   * @inheritdoc
   */
  revive: (_key, storeObject) => storeObject,
} as const;

export default simpleStorageHandler;
