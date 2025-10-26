/**
 * CSS セレクタとして有効かを判定する
 * @param selector 判定するセレクタ文字列
 * @returns 有効な場合は true、無効な場合は false
 */
export function isValidSelector(selector: string): boolean {
  try {
    document.createDocumentFragment().querySelector(selector)
    return true
  }
  catch {
    return false
  }
}
