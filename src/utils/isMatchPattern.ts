import { matchPattern } from 'browser-extension-url-match'
import { parsePath, withTrailingSlash } from 'ufo'

import { isValidPattern } from './isValidPattern'
import { isValidUrl } from './isValidUrl'

/**
 * 指定のURLが指定のパターンにマッチするかを判定します。
 *
 * @param pattern - 判定対象のURLパターン（例: `*://*.blizzard.com/ja-jp/battlegrounds/*`）
 * @param url - 判定対象のURL。指定がなければ `location.href`
 * @param options - 加工オプション。`processUrl` が true の場合、pathnameのみをスラッシュ付きで使用。
 * @returns パターンとURLでマッチすればtrue, パターンかURLが不正、またはマッチしなければfalse
 */
export function isMatchPattern(
  pattern: string,
  url: string = location.href,
  options: { processUrl?: boolean } = {}
): boolean {
  if (!isValidPattern(pattern)) return false
  if (!isValidUrl(url)) return false

  const { match } = matchPattern(pattern).assertValid()

  const targetUrl = options.processUrl
    ? withTrailingSlash(parsePath(url).pathname)
    : url

  return match(targetUrl)
}
