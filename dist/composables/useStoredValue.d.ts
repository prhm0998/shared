import { UseAsyncStateOptions } from '@vueuse/core';
import { StorageItemKey } from '@wxt-dev/storage';
export declare function useStoredValue<T>(key: StorageItemKey, initialValue: T, opts?: UseAsyncStateOptions<true, T>): any;
