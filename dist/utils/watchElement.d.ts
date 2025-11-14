export interface WatchElementController {
    /** 監視を停止します。 */
    disconnect: () => void;
    /** 監視を停止し、初期要素の走査からやり直して、再び監視を開始します。 */
    restart: () => void;
    /** 監視に利用されている MutationObserver のインスタンスです。 */
    observer: MutationObserver;
}
/**
 * 指定要素以下を監視し、クエリに一致する新規要素（または既存要素）を検出してコールバックを実行する。
 * @returns 監視の制御を行うコントローラーオブジェクト。
 */
export declare function watchElement(targetElement: HTMLElement, query: string, callback: (element: HTMLElement) => void, options?: MutationObserverInit | null): WatchElementController;
