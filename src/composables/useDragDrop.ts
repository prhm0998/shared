// useDragDrop.ts

import { ref } from "vue"

/**
 * @fileoverview リスト要素の並べ替え（スワップ）と削除（リムーブ）を処理するためのドラッグ＆ドロップ用コンポーザブル関数。
 *
 * この関数は、Vue.jsのリアクティブな状態管理（ref）を用いて、
 * ドラッグ操作に必要なインデックスと、コンテナからの離脱/侵入を追跡します。
 *
 * 【使い方】
 * 1. コンポーネント内でインポートし、データとコールバックを渡します。
 *
 * const items = ref(['A', 'B', 'C'])
 * const { start, drop, end, dragEnterParent, dragLeaveParent, startIndex } = useDragDrop({
 * onSwap: (from, to) => {
 * // 配列の要素を入れ替えるロジックを実装
 * const item = items.value.splice(from, 1)[0]
 * items.value.splice(to, 0, item)
 * },
 * onRemove: (index) => {
 * // 配列から要素を削除するロジックを実装
 * items.value.splice(index, 1)
 * }
 * })
 *
 * 2. テンプレート内でHTMLイベントにバインドします。
 *
 * // --- 親要素（リスト全体）にバインド ---
 * <ul
 * @dragenter.prevent="dragEnterParent"
 * @dragleave="dragLeaveParent"
 * @dragover.prevent // dropを許可するために必要
 * >
 * // --- 子要素（各アイテム）にバインド ---
 * <li
 * v-for="(item, index) in items"
 * :key="item"
 * draggable="true"
 * @dragstart="start(index)"
 * @drop="drop(index)"
 * @dragend="end"
 * :class="{ 'is-dragging': startIndex === index }"
 * >
 * {{ item }}
 * </li>
 * </ul>
 *
 * @param options - ドラッグ操作完了時の処理を定義するコールバック関数。
 * @param options.onSwap - 別の要素の上でドロップされたときに呼び出されます (from:元のindex, to:先のindex)。
 * @param options.onRemove - コンテナ外でドロップされたときに呼び出されます (index:元のindex)。
 * @returns ドラッグの状態と操作用のイベントハンドラ関数。
 */
export function useDragDrop(options?: {
  onSwap?: (from: number, to: number) => void
  onRemove?: (index: number) => void
}) {
  const startIndex = ref<number | null>(null)
  const endIndex = ref<number | null>(null)
  const dragLeaveEnterCounter = ref(0)
  const dragLeaveCounter = ref(0)

  const start = (index: number) => {
    startIndex.value = index
  }

  const drop = (index: number) => {
    if (startIndex.value === null) return
    if (startIndex.value === index) return
    endIndex.value = index
  }

  const end = () => {
    if (startIndex.value === null) return
    if (dragLeaveEnterCounter.value === 0 && dragLeaveCounter.value > 1) {
      options?.onRemove?.(startIndex.value)
    } else {
      if (endIndex.value !== null) {
        options?.onSwap?.(startIndex.value, endIndex.value)
      }
    }
    reset()
  }

  const dragLeaveParent = () => {
    dragLeaveEnterCounter.value--
    dragLeaveCounter.value++
  }

  const dragEnterParent = () => {
    dragLeaveEnterCounter.value++
  }

  const reset = () => {
    startIndex.value = null
    endIndex.value = null
    dragLeaveEnterCounter.value = 0
    dragLeaveCounter.value = 0
  }

  return {
    // 状態
    startIndex,
    endIndex,
    dragLeaveEnterCounter,
    dragLeaveCounter,
    // イベントハンドラ
    start,
    drop,
    end,
    dragLeaveParent,
    dragEnterParent,
    reset,
  }
}
