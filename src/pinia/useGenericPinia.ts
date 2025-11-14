import { defineStore } from 'pinia'

import { useGenericStore } from '../composables/useGenericStore'

//---------------------------------------------------------
// useGnericStoreでstateを作成するパターン
//---------------------------------------------------------
//
//export const useStoredModal = () => {
//  return useGenericStore<ModalState, ModalUpdateEvent>(
//    'local:modalState', getDefaultState, deserialize, serealize, updateStateLogic
//  )
//}
//
// 呼び出し側
// const { state, updateState} = useStoredModal()
//

//---------------------------------------------------------
// useGenericPiniaでstateを作成するパターン
//---------------------------------------------------------
//
//export const usePiniaModal = useGenericPinia<ModalState, ModalUpdateEvent>(
//  'local:modalState', getDefaultState, deserialize, serealize, updateStateLogic
//)
//
// 呼び出し側
// const modalStore = usePiniaModal()
// const { state } = storeToRefs(modalStore)
// const { updateState } = modalStore
// ※ storeToRefsを使ってstateをRefにする
//

export const useGenericPinia = <S, E>(
  ...args: Parameters<typeof useGenericStore<S, E>>
) =>
  defineStore(args[0], () => {
    const { state, updateState } = useGenericStore(
      ...args
    )
    return { state, updateState }
  })