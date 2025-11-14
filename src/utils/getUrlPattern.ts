interface GetMatchUrlOption {
  directoryDepth?: number
}

/**
 * URL からパターンマッチ用文字列を生成する
 * - URLとして評価できない文字列は例外となります
 * - プロトコルは常に "*://" に置き換える
 * - ドメインはそのまま使用する（サブドメイン含む）
 * - directoryDepth の数値だけサブディレクトリを保持し、残りを "/*" とする
 *
 * 例:
 * getMatchUrl('https://hearthstone.blizzard.com/ja-jp/battlegrounds?bgGameMode=solos')
 * -> '*://hearthstone.blizzard.com/*'
 *
 * getMatchUrl('https://example.com/foo/bar', { directoryDepth: 1 })
 * -> '*://example.com/foo/*'
 */
export function getUrlPattern(
  urlSource: string,
  option: GetMatchUrlOption = {}
): string {
  try {
    const { directoryDepth = 0 } = option
    const url = new URL(urlSource)

    // プロトコルは常に *
    const protocol = '*://'

    // ホスト部分（そのまま利用）
    const hostPart = url.hostname

    // パス部分：指定した階層まで残して、その下はワイルドカード
    const tempSegments = url.pathname
      .split('/')
      .filter(Boolean)
    const pathSegments = tempSegments.slice(0, directoryDepth)

    const pathPart = pathSegments.length
      ? `/${pathSegments.join('/')}/*`
      : '/*'

    return `${protocol}${hostPart}${pathPart}`
  }
  catch {
    throw new Error('Invalid URL provided')
  }
}
