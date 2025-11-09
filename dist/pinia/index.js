import { defineStore } from 'pinia';
import { u as useGenericStore } from '../chunk/useGenericStore.js';

const useGenericPinia = (key, getDefaultState, deserialize, serialize, updateStateLogic) => defineStore(key, () => {
  const { state, updateState } = useGenericStore(
    key,
    getDefaultState,
    deserialize,
    serialize,
    updateStateLogic
  );
  return { state, updateState };
});

export { useGenericPinia };
//# sourceMappingURL=index.js.map
