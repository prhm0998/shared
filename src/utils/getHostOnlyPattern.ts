import { matchPattern } from 'browser-extension-url-match'

/**
 * パターン文字列をホストのみ指定のパターン文字列に変換します
 */
export function getHostOnlyPattern(urlPattern: string): string | null {
  const validPattern = matchPattern(urlPattern).valid
  if (!validPattern) {
    return null
  }
  // URLパターンを正規表現で分解
  const match = urlPattern.match(/^(\*:\/\/[^/]+)(\/.*)?$/)
  if (!match) {
    return null
  }

  const host = match[1]       // '*://hearthstone.blizzard.com'
  const path = match[2] || '' // '/card' など

  // パスが空、または '/' だけの場合はそのまま返す
  if (path === '' || path === '/') {
    return urlPattern
  }

  // サブディレクトリがある場合は '/*' に置き換える
  return `${host}/*`
}