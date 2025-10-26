/**
 * 指定要素以下を監視し、クエリに一致する新規要素（または既存要素）を検出してコールバックを実行する。
 */
export declare function elementWatch(targetElement: HTMLElement, query: string, callback: (element: HTMLElement) => void, options?: MutationObserverInit | null): MutationObserver;
