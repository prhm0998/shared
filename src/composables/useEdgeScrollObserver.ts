// useEdgeScrollObserver.ts
import { onUnmounted, ref, type Ref } from 'vue'
/**
 * スクロール要素の端到達を監視し、指定されたイベントを実行する汎用Composables
 *
 * @param elementRef 監視対象のHTMLElementのRef
 * @param scrollDirection スクロール方向 ('horizontal' | 'vertical')、デフォルトは 'vertical'
 * @param threshold 端到達と判定するしきい値 (px)、デフォルトは 500
 * @param onEdgeReached 端に到達したときに実行するコールバック関数
 */
export function useEdgeScrollObserver(
  elementRef: Ref<HTMLElement | null>,
  scrollDirection: 'horizontal' | 'vertical' = 'vertical',
  threshold: number = 500,
  onEdgeReached?: () => void
) {
  const isWaitingForNextPage = ref(false)

  // 縦向き・横向きのスクロール情報取得ヘルパー
  const getScrollMetrics = (el: HTMLElement) => {
    if (scrollDirection === 'horizontal') {
      const scrollAmount = Math.abs(el.scrollLeft)
      const maxScroll = el.scrollWidth - el.clientWidth
      const currentScrollPosition = scrollAmount
      const distanceToContentEnd = maxScroll - currentScrollPosition

      return {
        isAtEnd: distanceToContentEnd < threshold,
        distanceToContentEnd: distanceToContentEnd,
        maxScroll: maxScroll,
      }
    }
    else {
      const scrollAmount = el.scrollTop
      const maxScroll = el.scrollHeight - el.clientHeight
      const currentScrollPosition = scrollAmount
      const distanceToContentEnd = maxScroll - currentScrollPosition

      return {
        isAtEnd: distanceToContentEnd < threshold,
        distanceToContentEnd: distanceToContentEnd,
        maxScroll: maxScroll,
      }
    }
  }

  /** スクロールイベントハンドラ */
  const onScroll = () => {
    const el = elementRef.value

    if (!el || isWaitingForNextPage.value) {
      return
    }

    const { isAtEnd } = getScrollMetrics(el)

    // 端に到達した判定
    if (isAtEnd) {
      // 監視を停止 利用側でresumeObserverで再開
      isWaitingForNextPage.value = true

      // 呼び出し側で指定されたイベントを実行
      onEdgeReached?.()
    }
  }

  /** 監視を再開 (onEdgeReached の処理完了後に呼び出す) */
  const resumeObserver = () => {
    isWaitingForNextPage.value = false
  }

  const setupObserver = () => {
    const el = elementRef.value
    if (!el) return
    el.addEventListener('scroll', onScroll, { passive: true })
  }

  const cleanupObserver = () => {
    const el = elementRef.value
    if (el) {
      el.removeEventListener('scroll', onScroll)
    }
  }

  onUnmounted(cleanupObserver)

  return {
    setupObserver,
    cleanupObserver,
    resumeObserver,
  }
}