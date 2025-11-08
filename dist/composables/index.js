import { ref, onUnmounted } from 'vue';
export { u as useGenericStore, a as useStoredValue } from '../useGenericStore.js';

function useDragDrop(options) {
  const startIndex = ref(null);
  const endIndex = ref(null);
  const dragLeaveEnterCounter = ref(0);
  const dragLeaveCounter = ref(0);
  const start = (index) => {
    startIndex.value = index;
  };
  const drop = (index) => {
    if (startIndex.value === null) return;
    if (startIndex.value === index) return;
    endIndex.value = index;
  };
  const end = () => {
    if (startIndex.value === null) return;
    if (dragLeaveEnterCounter.value === 0 && dragLeaveCounter.value > 1) {
      options?.onRemove?.(startIndex.value);
    } else {
      if (endIndex.value !== null) {
        options?.onSwap?.(startIndex.value, endIndex.value);
      }
    }
    reset();
  };
  const dragLeaveParent = () => {
    dragLeaveEnterCounter.value--;
    dragLeaveCounter.value++;
  };
  const dragEnterParent = () => {
    dragLeaveEnterCounter.value++;
  };
  const reset = () => {
    startIndex.value = null;
    endIndex.value = null;
    dragLeaveEnterCounter.value = 0;
    dragLeaveCounter.value = 0;
  };
  return {
    // 状態
    startIndex,
    endIndex,
    dragLeaveEnterCounter,
    dragLeaveCounter,
    // イベントハンドラ
    start,
    drop,
    end,
    dragLeaveParent,
    dragEnterParent,
    reset
  };
}

function useEdgeScrollObserver(elementRef, scrollDirection = "vertical", threshold = 500, onEdgeReached) {
  const isWaitingForNextPage = ref(false);
  const getScrollMetrics = (el) => {
    if (scrollDirection === "horizontal") {
      const scrollAmount = Math.abs(el.scrollLeft);
      const maxScroll = el.scrollWidth - el.clientWidth;
      const currentScrollPosition = scrollAmount;
      const distanceToContentEnd = maxScroll - currentScrollPosition;
      return {
        isAtEnd: distanceToContentEnd < threshold,
        distanceToContentEnd,
        maxScroll
      };
    } else {
      const scrollAmount = el.scrollTop;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const currentScrollPosition = scrollAmount;
      const distanceToContentEnd = maxScroll - currentScrollPosition;
      return {
        isAtEnd: distanceToContentEnd < threshold,
        distanceToContentEnd,
        maxScroll
      };
    }
  };
  const onScroll = () => {
    const el = elementRef.value;
    if (!el || isWaitingForNextPage.value) {
      return;
    }
    const { isAtEnd } = getScrollMetrics(el);
    if (isAtEnd) {
      isWaitingForNextPage.value = true;
      onEdgeReached?.();
    }
  };
  const resumeObserver = () => {
    isWaitingForNextPage.value = false;
  };
  const setupObserver = () => {
    const el = elementRef.value;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
  };
  const cleanupObserver = () => {
    const el = elementRef.value;
    if (el) {
      el.removeEventListener("scroll", onScroll);
    }
  };
  onUnmounted(cleanupObserver);
  return {
    setupObserver,
    cleanupObserver,
    resumeObserver
  };
}

function useWindowScrollLock() {
  const isScrollLocked = ref(false);
  let isListenerAttached = false;
  const preventWindowScroll = (e) => {
    if (isScrollLocked.value) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };
  const attachListeners = () => {
    if (isListenerAttached) return;
    window.addEventListener("scroll", preventWindowScroll, { capture: true, passive: false });
    window.addEventListener("wheel", preventWindowScroll, { capture: true, passive: false });
    window.addEventListener("touchmove", preventWindowScroll, { capture: true, passive: false });
    isListenerAttached = true;
  };
  const detachListeners = () => {
    if (!isListenerAttached) return;
    window.removeEventListener("scroll", preventWindowScroll, { capture: true });
    window.removeEventListener("wheel", preventWindowScroll, { capture: true });
    window.removeEventListener("touchmove", preventWindowScroll, { capture: true });
    isListenerAttached = false;
  };
  function lockScroll() {
    if (isScrollLocked.value) return;
    isScrollLocked.value = true;
    attachListeners();
  }
  function unlockScroll() {
    if (!isScrollLocked.value) return;
    isScrollLocked.value = false;
    detachListeners();
  }
  onUnmounted(detachListeners);
  return {
    isScrollLocked,
    // 現在のロック状態 (必要なら外部に公開)
    lockScroll,
    // ロック開始
    unlockScroll
    // ロック解除
  };
}

export { useDragDrop, useEdgeScrollObserver, useWindowScrollLock };
//# sourceMappingURL=index.js.map
