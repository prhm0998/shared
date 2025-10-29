/**
 * ウィンドウのスクロール操作をロック/解除する機能を提供するComposables。
 * すべての状態とロジックはこの関数内部で完結します。
 */
export declare function useWindowScrollLock(): {
    isScrollLocked: any;
    lockScroll: () => void;
    unlockScroll: () => void;
};
