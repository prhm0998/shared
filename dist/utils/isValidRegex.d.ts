/**
 * 入力された文字列が有効な正規表現（RegExp）としてコンパイルできるかを確認する関数です。
 *
 * @param input 確認対象の文字列
 * @returns 有効な正規表現であれば true、文法エラーがあれば false を返します。
 * @throws SyntaxError 以外の予期せぬエラーが発生した場合、そのエラーを再スローします。
 */
export declare function isValidRegex(input: string): boolean;
