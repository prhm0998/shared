import { useGenericStore } from '../composables/useGenericStore';
export declare const useGenericPinia: <S, E>(...args: Parameters<typeof useGenericStore<S, E>>) => import('pinia').StoreDefinition<`local:${string}` | `session:${string}` | `sync:${string}` | `managed:${string}`, Pick<{
    state: import('vue').Ref<S, S>;
    updateState: (event: E) => void;
}, "state">, Pick<{
    state: import('vue').Ref<S, S>;
    updateState: (event: E) => void;
}, never>, Pick<{
    state: import('vue').Ref<S, S>;
    updateState: (event: E) => void;
}, "updateState">>;
