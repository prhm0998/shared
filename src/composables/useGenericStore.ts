import { useDebounceFn } from '@vueuse/core'
import type { StorageItemKey } from '@wxt-dev/storage'
import { ref, watch } from 'vue'
import type { Ref } from 'vue'

import { useStoredValue } from './useStoredValue'

// ----------------------------------------------------
// composables/useStoredValueを拡張し、更新イベントを設定できるようにします。
// ----------------------------------------------------

// S: 状態の型 (State), E: イベントの型 (Event)
export type GenericStore<S, E> = { state: Ref<S>, updateState: (event: E) => void }
export type UpdateStateFn<S, E> = (state: Ref<S>, event: E) => void

/**
 * 汎用的な状態管理と永続化を行うコンポーザブル関数。
 * * @template S 状態の型
 * @template E 更新イベントの型
 * @param key ストレージキー
 * @param getDefaultState 初期状態を返す関数
 * @param deserialize JSON文字列を状態オブジェクトに変換する関数
 * @param serialize 状態オブジェクトをJSON文字列に変換する関数
 * @param updateStateLogic 状態の更新ロジックを実行する関数
 * @returns 状態 (state) と状態更新関数 (updateState) を含むオブジェクト
 */
export function useGenericStore<S, E>(
  key: StorageItemKey,
  getDefaultState: () => S,
  deserialize: (json: string) => S,
  serialize: (state: S) => string,
  updateStateLogic: UpdateStateFn<S, E>
): GenericStore<S, E> {

  const { state: storedJson } = useStoredValue(key, serialize(getDefaultState()))

  const memoryCache = ref<S>(deserialize(storedJson.value)) as Ref<S> // 初期値はストレージから取得（またはデフォルト）

  watch(storedJson, (newVal) => {
    memoryCache.value = deserialize(newVal)
  })

  const saveToStorage = useDebounceFn(() => {
    storedJson.value = serialize(memoryCache.value)
  }, 300, { maxWait: 1000 })

  watch(memoryCache, () => saveToStorage(), { deep: true })

  const updateState = (event: E) => {
    updateStateLogic(memoryCache, event)
  }

  return {
    // readonlyは諦める
    state: memoryCache,
    updateState,
  }
}
