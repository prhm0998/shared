/**
 * 指定のURLが指定のパターンにマッチするかを判定します。
 *
 * @param pattern - 判定対象のURLパターン（例: `*://*.blizzard.com/ja-jp/battlegrounds/*`）
 * @param url - 判定対象のURL。指定がなければ `location.href`
 * @param options - 加工オプション。`processUrl` が true の場合、pathnameのみをスラッシュ付きで使用。
 * @returns パターンとURLでマッチすればtrue, パターンかURLが不正、またはマッチしなければfalse
 */
export declare function isMatchPattern(pattern: string | string[], url?: string, options?: {
    processUrl?: boolean;
}): boolean;
