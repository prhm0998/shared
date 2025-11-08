/**
 * クリップボードに文字列をコピーします。
 * 成功時は true、失敗時は false を返します。
 */
export async function copyToClipboardText(text: string): Promise<boolean> {
  if (!text) return false

  try {
    await navigator.clipboard.writeText(text)
    return true
  }
  catch (e) {
    console.error('Copy failed:', e)
    return false
  }
}
