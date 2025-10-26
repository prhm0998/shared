import { UseAsyncStateOptions, useAsyncState } from '@vueuse/core'
import { computed, onMounted } from 'vue'
import { storage, StorageItemKey } from '@wxt-dev/storage'

export function useStoredValue<T>(
  key: StorageItemKey,
  initialValue: T,
  opts?: UseAsyncStateOptions<true, T>
) {
  const {
    state,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    execute: _, // Don't include "execute" in returned object
    ...asyncState
  } = useAsyncState<T, [], true>(
    async () => (await storage.getItem(key, { fallback: initialValue })) ?? initialValue,
    initialValue,
    opts
  )

  // Listen for changes
  let unwatch: (() => void) | undefined
  onMounted(() => {
    unwatch = storage.watch<T>(key, async (newValue) => {
      state.value = newValue ?? initialValue
    })
    unwatch?.()
  })
  return {
    // Use a writable computed ref to write updates to storage
    state: computed({
      get() {
        return state.value
      },
      set(newValue) {
        void storage.setItem(key, newValue)
        state.value = newValue
      },
    }),
    ...asyncState,
  }
}