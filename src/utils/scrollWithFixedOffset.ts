/**
 * 指定した要素が、指定のオフセット位置に来るようにスムーズスクロールします。
 *
 * 要素の現在のビューポート内での位置（getBoundingClientRect）を取得し、
 * window.scrollY と組み合わせて最終的なスクロール目標位置を計算します。
 *
 * offsetの計算に使える関連関数 @function getFixedElementsTotalHeight
 *
 * @param el - スクロール対象となる DOM 要素
 * @param offset - 上端からどれだけ離すか（px）。固定ヘッダーなどがある場合に使用
 */
export function scrollWithFixedOffset(el: HTMLElement, offset: number) {
  const rect = el.getBoundingClientRect()
  const scrollTop = window.scrollY + rect.top - offset
  window.scrollTo({ top: scrollTop, behavior: 'smooth' })
}