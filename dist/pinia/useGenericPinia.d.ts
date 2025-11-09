import { StorageItemKey } from '@wxt-dev/storage';
import { UpdateStateFn } from '../composables/useGenericStore';
export declare const useGenericPinia: <S, E>(key: StorageItemKey, getDefaultState: () => S, deserialize: (json: string) => S, serialize: (state: S) => string, updateStateLogic: UpdateStateFn<S, E>) => import('pinia').StoreDefinition<`local:${string}` | `session:${string}` | `sync:${string}` | `managed:${string}`, Pick<{
    state: import('vue').Ref<S, S>;
    updateState: (event: E) => void;
}, "state">, Pick<{
    state: import('vue').Ref<S, S>;
    updateState: (event: E) => void;
}, never>, Pick<{
    state: import('vue').Ref<S, S>;
    updateState: (event: E) => void;
}, "updateState">>;
