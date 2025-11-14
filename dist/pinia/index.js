import { defineStore } from 'pinia';
import { u as useGenericStore } from '../chunk/useGenericStore.js';

const useGenericPinia = (...args) => defineStore(args[0], () => {
  const { state, updateState } = useGenericStore(
    ...args
  );
  return { state, updateState };
});

export { useGenericPinia };
//# sourceMappingURL=index.js.map
