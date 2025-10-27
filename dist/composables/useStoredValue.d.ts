import { type UseAsyncStateOptions } from '@vueuse/core';
import { type StorageItemKey } from '@wxt-dev/storage';
export declare function useStoredValue<T>(key: StorageItemKey, initialValue: T, opts?: UseAsyncStateOptions<true, T>): {
    stop: () => void;
    isReady: import("vue").Ref<boolean>;
    isLoading: import("vue").Ref<boolean>;
    error: import("vue").Ref<unknown>;
    executeImmediate: () => Promise<T>;
    then<TResult1 = import("@vueuse/core").UseAsyncStateReturnBase<T, [], true>, TResult2 = never>(onfulfilled?: ((value: import("@vueuse/core").UseAsyncStateReturnBase<T, [], true>) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2>;
    state: import("vue").WritableComputedRef<T, T>;
};
