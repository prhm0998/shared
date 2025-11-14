interface GetMatchUrlOption {
    directoryDepth?: number;
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
export declare function getUrlPattern(urlSource: string, option?: GetMatchUrlOption): string;
export {};
