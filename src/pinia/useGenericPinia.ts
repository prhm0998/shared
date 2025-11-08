import type { StorageItemKey } from '@wxt-dev/storage'
import { defineStore } from 'pinia'

import { useGenericStore, type UpdateStateFn } from '../composables/useGenericStore'

//
// useGnericStoreでstateを作成するパターン
//
//export const useStoredModal = () => {
//  return useGenericStore<ModalState, ModalUpdateEvent>(
//    'local:modalState', getDefaultState, deserialize, serealize, updateStateLogic
//  )
//}

//
//
// useGenericPiniaでstateを作成するパターン
//
//export const usePiniaModal = useGenericPinia<ModalState, ModalUpdateEvent>(
//  'local:modalState', getDefaultState, deserialize, serealize, updateStateLogic
//)

export const useGenericPinia = <S, E>(
  key: StorageItemKey,
  getDefaultState: () => S,
  deserialize: (json: string) => S,
  serialize: (state: S) => string,
  updateStateLogic: UpdateStateFn<S, E>
) =>
  defineStore(key, () => {
    const { state, updateState } = useGenericStore(
      key, getDefaultState, deserialize, serialize, updateStateLogic
    )
    return { state, updateState }
  })