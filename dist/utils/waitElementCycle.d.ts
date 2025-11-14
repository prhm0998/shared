import { waitElement } from '@1natsu/wait-element';
export interface WaitElementCycleCallbacks<Result> {
    onFound?: (el: Result) => void | Promise<void>;
    onRemove?: (el: Result) => void | Promise<void>;
}
/**
 * 要素が削除されたときの共通処理を行う
 */
export declare function handleElementRemoval<Result>(el: Result, stopWatcher: (() => void) | undefined, onRemoveCallback?: (el: Result) => void | Promise<void>): Promise<void>;
/**
 * 指定した要素がDOM上に現れるまで待機し、削除された場合は再び探索を行う。
 * コールバックはオブジェクト形式で指定。
 *
 * @returns 再実行用関数
 */
export declare function waitElementCycle<Result = Element, QuerySelectorResult extends Element | null = Element | null>(callbacks: WaitElementCycleCallbacks<Result>, ...args: Parameters<typeof waitElement<Result, QuerySelectorResult>>): {
    restart: () => Promise<void>;
};
