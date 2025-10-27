import { useDebounceFn } from '@vueuse/core' // useDebounceFn を想定
import { type StorageItemKey } from '@wxt-dev/storage'
import { ref, watch, type Ref } from 'vue' // Vueのコア関数
import { useStoredValue } from './useStoredValue'

// ----------------------------------------------------
// composables/useStoredValueを拡張し、更新イベントを設定できるようにします。
// ----------------------------------------------------

// 状態更新ロジック関数の型を汎用的に定義します
// S: 状態の型 (State), E: イベントの型 (Event)
export type UpdateStateFn<S, E> = (state: Ref<S>, event: E) => void

// ----------------------------------------------------
// 汎用コンポーザブル関数
// ----------------------------------------------------

/**
 * 汎用的な状態管理と永続化を行うコンポーザブル関数。
 * * @template S 状態の型 (例: UserOption)
 * @template E 更新イベントの型 (例: UserOptionUpdateEvent)
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
) {
  // 1. ストレージの値と同期するリアクティブな Ref
  const { state: storedJson } = useStoredValue(key, serialize(getDefaultState()))

  // 2. メモリ内のキャッシュ状態
  const memoryCache = ref<S>(deserialize(storedJson.value)) as Ref<S> // 初期値はストレージから取得（またはデフォルト）

  // 3. ストレージ JSON文字列 → メモリ状態 の同期
  watch(storedJson, (newVal) => {
    // デシリアライズに失敗した場合もデフォルト値で安全に復元されることを想定
    memoryCache.value = deserialize(newVal)
  })

  // 4. メモリ状態 → ストレージ JSON文字列 の同期（デバウンス処理）
  // 頻繁な書き込みを防ぐため、デバウンスを使用
  const saveToStorage = useDebounceFn(() => {
    storedJson.value = serialize(memoryCache.value)
  }, 300, { maxWait: 1000 })

  // memoryCache の deep watch で変更を検知し、ストレージに保存
  watch(memoryCache, () => saveToStorage(), { deep: true })

  // 5. 状態更新関数のラッパー (引数として受け取ったロジックを実行)
  // この関数の event の型はジェネリクス E となります。
  const updateState = (event: E) => {
    // ローカルな memoryCache (Ref) とイベントを、外部から渡されたロジック関数に渡します
    updateStateLogic(memoryCache, event)
  }

  return {
    //state: readonly(memoryCache) as DeepReadonly<Ref<S>>,
    state: memoryCache,
    // 外部に公開する状態更新関数
    updateState,
  }
}
