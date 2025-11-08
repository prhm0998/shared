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
 * composables/useStoredValueを拡張し、更新イベントを設定できるようにします。
 * @template S 状態の型 (例: UserOption)
 * @template E 更新イベントの型 (例: UserOptionUpdateEvent)
 * @param key ストレージキー
 * @param getDefaultState <S>の初期状態を返す関数
 * @param deserialize JSON文字列を<S>に変換する関数
 * @param serialize <S>をJSON文字列に変換する関数
 * @param updateStateLogic 状態の更新ロジックを実行し、変更後の<S>を返す関数
 * @param options デバウンス設定オプション
 * @param options.debounceDelay デバウンスの遅延時間 (ミリ秒)。デフォルト: `50`
 * @param options.debounceMaxWait 最大遅延時間 (ミリ秒)。デフォルト: `1000`
 *
 * @returns
 *  `state`: 現在の状態を保持する `Ref<S>`
 *  `updateState`: イベントを受け取り状態を更新する関数
 */

export function useGenericStore<S, E>(
  key: StorageItemKey,
  getDefaultState: () => S,
  deserialize: (json: string) => S,
  serialize: (state: S) => string,
  updateStateLogic: UpdateStateFn<S, E>,
  options?: {
    debounceDelay?: number
    debounceMaxWait?: number
  }
): GenericStore<S, E> {

  const debounceDelay = options?.debounceDelay ?? 300
  const debounceMaxWait = options?.debounceMaxWait ?? 1000

  const { state: storedJson } = useStoredValue(key, serialize(getDefaultState()))

  const memoryCache = ref<S>(deserialize(storedJson.value)) as Ref<S>

  watch(storedJson, (newVal) => {
    memoryCache.value = deserialize(newVal)
  })

  const saveToStorage = useDebounceFn(() => {
    storedJson.value = serialize(memoryCache.value)
  }, debounceDelay, { maxWait: debounceMaxWait })

  watch(memoryCache, () => saveToStorage(), { deep: true })

  const updateState = (event: E) => {
    updateStateLogic(memoryCache, event)
  }

  return {
    state: memoryCache, //readonlyは諦める
    updateState,
  }
}
