type ScrollDirection = 'vertical' | 'horizontal';
type SmoothScrollCallback<T extends SmoothScrollStopReason | void> = (result: T extends SmoothScrollStopReason ? SmoothScrollResult : void) => void;
interface SmoothScrollBaseOptionsBase {
    direction?: ScrollDirection;
    timeout?: number;
    onStart?: SmoothScrollCallback<void>;
    onFinish?: SmoothScrollCallback<SmoothScrollStopReason>;
}
interface SmoothScrollDurationOptions {
    mode: 'duration';
    duration: number;
    minSpeedPerMs?: number;
    maxSpeedPerMs?: number;
}
interface SmoothScrollSpeedOption {
    mode: 'speed';
    speedPerMs: number;
}
type SmoothScrollOptions = (SmoothScrollBaseOptionsBase & SmoothScrollDurationOptions) | (SmoothScrollBaseOptionsBase & SmoothScrollSpeedOption);
export type SmoothScrollStopReason = 'TargetReached' | 'ScrollStagnated' | 'Timeout' | 'ManualStop' | 'Error';
export interface SmoothScrollResult {
    reason: SmoothScrollStopReason;
}
interface SmoothScroll {
    (el: HTMLElement, amount: number, options: SmoothScrollOptions): Promise<SmoothScrollResult>;
}
export declare const smoothScroll: SmoothScroll;
export {};
