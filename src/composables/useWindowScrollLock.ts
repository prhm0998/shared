// useScrollLock.ts
import { ref, onUnmounted } from 'vue'

/**
 * ウィンドウのスクロール操作をロック/解除する機能を提供するComposables。
 * すべての状態とロジックはこの関数内部で完結します。
 */
export function useWindowScrollLock() {
  const isScrollLocked = ref(false)
  let isListenerAttached = false
  const preventWindowScroll = (e: Event) => {
    if (isScrollLocked.value) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
  }

  const attachListeners = () => {
    if (isListenerAttached) return
    window.addEventListener('scroll', preventWindowScroll, { capture: true, passive: false })
    window.addEventListener('wheel', preventWindowScroll, { capture: true, passive: false })
    window.addEventListener('touchmove', preventWindowScroll, { capture: true, passive: false })

    isListenerAttached = true
  }

  const detachListeners = () => {
    if (!isListenerAttached) return

    window.removeEventListener('scroll', preventWindowScroll, { capture: true })
    window.removeEventListener('wheel', preventWindowScroll, { capture: true })
    window.removeEventListener('touchmove', preventWindowScroll, { capture: true })

    isListenerAttached = false
  }

  /** スクロール操作を一時的にロックする */
  function lockScroll() {
    if (isScrollLocked.value) return
    isScrollLocked.value = true
    attachListeners()
  }

  /** スクロールロックを解除する */
  function unlockScroll() {
    if (!isScrollLocked.value) return
    isScrollLocked.value = false
    detachListeners()
  }

  onUnmounted(detachListeners)

  return {
    isScrollLocked, // 現在のロック状態 (必要なら外部に公開)
    lockScroll,     // ロック開始
    unlockScroll,   // ロック解除
  }
}