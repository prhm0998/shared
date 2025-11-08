/**
 * URL妥当性チェック
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  }
  catch {
    return false
  }
}