/**
 * 指定した DOM 要素がドキュメントから削除されたかを監視する関数
 *
 * @param element 監視対象の DOM 要素
 * @param callback 要素が削除されたときに実行されるコールバック関数
 * @param interval チェック間隔（ミリ秒）。デフォルトは1000ms（1秒）
 * @returns 監視を停止するためのクリーンアップ関数
 */
export declare const watchElementRemoval: (element: Element, callback: () => void, interval?: number) => (() => void) | undefined;
