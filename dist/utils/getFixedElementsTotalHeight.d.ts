/**
 * 画面上部（top: 0）に固定配置されているすべての要素の合計高さを返します。
 *
 * DOM 全体から position: fixed かつ top: 0px の要素を抽出し、
 * それらの offsetHeight を合算して返します。
 * 固定ヘッダーが複数ある場合の総高さ計算などに利用できます。
 *
 * @returns 固定要素（top: 0px）の合計高さ（px）
 */
export declare function getFixedElementsTotalHeight(): number;
