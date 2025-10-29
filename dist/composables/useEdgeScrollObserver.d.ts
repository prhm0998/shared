import { Ref } from 'vue';
/**
 * スクロール要素の端到達を監視し、指定されたイベントを実行する汎用Composables
 *
 * @param elementRef 監視対象のHTMLElementのRef
 * @param scrollDirection スクロール方向 ('horizontal' | 'vertical')、デフォルトは 'vertical'
 * @param threshold 端到達と判定するしきい値 (px)、デフォルトは 500
 * @param onEdgeReached 端に到達したときに実行するコールバック関数
 */
export declare function useEdgeScrollObserver(elementRef: Ref<HTMLElement | null>, scrollDirection?: 'horizontal' | 'vertical', threshold?: number, onEdgeReached?: () => void): {
    setupObserver: () => void;
    cleanupObserver: () => void;
    resumeObserver: () => void;
};
