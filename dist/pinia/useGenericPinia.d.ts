import { StorageItemKey } from '@wxt-dev/storage';
import { UpdateStateFn } from '../composables/useGenericStore';
export declare const useGenericPinia: <S, E>(key: StorageItemKey, getDefaultState: () => S, deserialize: (json: string) => S, serialize: (state: S) => string, updateStateLogic: UpdateStateFn<S, E>) => any;
