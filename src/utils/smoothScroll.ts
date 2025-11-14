import { flexibleClamp } from './flexibleClamp'

type ScrollDirection = 'vertical' | 'horizontal'
type SmoothScrollCallback<T extends SmoothScrollStopReason | void> = (
  result: T extends SmoothScrollStopReason ? SmoothScrollResult : void,
) => void

interface SmoothScrollBaseOptionsBase {
  direction?: ScrollDirection
  timeout?: number

  onStart?: SmoothScrollCallback<void>
  onFinish?: SmoothScrollCallback<SmoothScrollStopReason>
}

interface SmoothScrollDurationOptions {
  mode: 'duration' // 識別タグ
  duration: number
  minSpeedPerMs?: number
  maxSpeedPerMs?: number
}

interface SmoothScrollSpeedOption {
  mode: 'speed' // 識別タグ
  speedPerMs: number
}

type SmoothScrollOptions
  = | (SmoothScrollBaseOptionsBase & SmoothScrollDurationOptions)
  | (SmoothScrollBaseOptionsBase & SmoothScrollSpeedOption)

// 終了の理由を表す型
export type SmoothScrollStopReason
  = | 'TargetReached' // 目的のスクロール量に到達した
  | 'ScrollStagnated' // スクロールができなくなった（端に到達など）
  | 'Timeout' // (将来的な機能) タイムアウトが発生した
  | 'ManualStop' // (将来的な機能) 外部から停止された
  | 'Error' // その他

// SmoothScroll 関数が返す Promise の結果型
export interface SmoothScrollResult {
  reason: SmoothScrollStopReason
}
// スクロール関数のインターフェース（変更なし）
interface SmoothScroll {
  (
    el: HTMLElement,
    amount: number,
    options: SmoothScrollOptions
  ): Promise<SmoothScrollResult>
}

export const smoothScroll: SmoothScroll = (el, amount, options) => {
  return new Promise<SmoothScrollResult>((resolve) => {
    // ----------------------------------------------------
    // 📜 ステップ 1: 初期値の設定と速度の算出
    // ----------------------------------------------------
    let animationId: number
    let timeoutId: number | undefined
    let finalResult: SmoothScrollResult | null = null

    const { timeout, onStart, onFinish } = options

    const originalResolve = resolve
    resolve = ((result: SmoothScrollResult) => {
      onFinish?.(result)
      originalResolve(result)
    }) as typeof resolve

    const finishScroll = (reason: SmoothScrollStopReason) => {
      if (animationId !== undefined) {
        cancelAnimationFrame(animationId)
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }
      finalResult = { reason }
    }

    // ⭐ 処理 5: タイマー切れで finishScroll を呼び出す
    if (timeout && timeout > 0) {
      timeoutId = setTimeout(() => {
        finishScroll('Timeout')
        if (finalResult) {
          resolve(finalResult)
        }
      }, timeout) as unknown as number // ブラウザ環境の setTimeout の戻り値の型対応
    }

    const direction = options.direction ?? 'vertical'
    const isVertical = direction === 'vertical'
    const mode = options.mode
    const totalTargetDistance = amount

    let absSpeedPerMs: number // 1ミリ秒あたりの絶対速度

    if (mode === 'duration') {
      // TypeA: durationとmin/maxSpeedPerMsを使用
      const opts = options as SmoothScrollDurationOptions & SmoothScrollBaseOptionsBase
      const { duration, minSpeedPerMs, maxSpeedPerMs } = opts

      // perFrame 計算ロジック変更: durationで割って速度（msごとの移動量）を直接計算
      absSpeedPerMs = flexibleClamp(
        Math.abs(totalTargetDistance / duration), { min: minSpeedPerMs, max: maxSpeedPerMs }
      )

      if (duration === 0) {
        if (isVertical) {
          el.scrollTop += totalTargetDistance
        }
        else {
          el.scrollLeft += totalTargetDistance
        }
        return finishScroll('Error')
      }
    }
    else if (mode === 'speed') {
      const opts = options as SmoothScrollSpeedOption & SmoothScrollBaseOptionsBase
      const { speedPerMs } = opts

      absSpeedPerMs = Math.abs(speedPerMs)
    }
    else {
      console.error('未定義のスクロールモードです。')
      return finishScroll('Error')
    }

    // 符号付きの計画速度を計算
    const sign = totalTargetDistance >= 0 ? 1 : -1
    const plannedSpeedPerMs: number = absSpeedPerMs * sign

    // ----------------------------------------------------
    // 📜 ステップ 2: アニメーション状態の初期化
    // ----------------------------------------------------

    const getPosition = () => isVertical ? el.scrollTop : el.scrollLeft

    let startTime: number | null = null
    let previousTime: number | null = null
    let previousFrameTime: number | null = null
    const INTERVAL_MS = 1

    const startPosition: number = getPosition()
    let previousPosition: number = startPosition
    let totalActualMoved = 0

    // ----------------------------------------------------
    // 📜 ステップ 3: アニメーションループ
    // ----------------------------------------------------

    onStart?.()

    const animateFrame = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime
        previousTime = currentTime
        previousFrameTime = currentTime
        animationId = requestAnimationFrame(animateFrame)
        return
      }

      const elapsed = currentTime - previousTime!
      if (previousFrameTime !== null && elapsed < INTERVAL_MS) {
        animationId = requestAnimationFrame(animateFrame)
        return
      }
      previousFrameTime = currentTime

      // ----------------------------------------------------
      // A. 移動距離の計算
      // ----------------------------------------------------

      const remainingDistance = totalTargetDistance - totalActualMoved

      // 次のステップで目標を超過するかどうかを判定
      let distanceToMove: number = plannedSpeedPerMs

      // 目標がプラス方向の場合 (amount > 0):
      // remainingDistanceが plannedSpeedPerMs よりも小さい（残りが少ない）なら、残りの距離に補正
      if (sign === 1 && remainingDistance < plannedSpeedPerMs) {
        distanceToMove = remainingDistance
      }
      // 目標がマイナス方向の場合 (amount < 0):
      // remainingDistance（マイナスの値）が plannedSpeedPerMs（マイナスの値）よりも大きい（残りが少ない）なら、残りの距離に補正
      else if (sign === -1 && remainingDistance > plannedSpeedPerMs) {
        distanceToMove = remainingDistance
      }
      // remainingDistanceが0の場合
      else if (remainingDistance === 0) {
        distanceToMove = 0
      }

      // ----------------------------------------------------
      // B. スクロールを試みる
      // ----------------------------------------------------
      if (isVertical) {
        el.scrollTop += distanceToMove
      }
      else {
        el.scrollLeft += distanceToMove
      }

      // ----------------------------------------------------
      // C. 実際の移動量と停滞の判定
      // ----------------------------------------------------

      const currentPosition = getPosition()

      const actualMove = currentPosition - previousPosition

      // 1. 停滞判定: 位置が変わらなければ終了
      if (actualMove === 0) {
        finishScroll('ScrollStagnated')
        if (finalResult) resolve(finalResult)
        return
      }

      // 2. 移動量の更新: 実際に動いた分を totalActualMoved に加算
      totalActualMoved += actualMove
      previousPosition = currentPosition

      // ----------------------------------------------------
      // D. 目標到達の判定
      // ----------------------------------------------------

      const isOverActualTarget = (sign === -1)
        ? totalActualMoved <= totalTargetDistance
        : totalActualMoved >= totalTargetDistance

      if (isOverActualTarget) {
        finishScroll('TargetReached')
        if (finalResult) resolve(finalResult)
        return
      }

      previousTime = currentTime

      // ----------------------------------------------------
      // E. 次のフレームを要求
      // ----------------------------------------------------
      animationId = requestAnimationFrame(animateFrame)
    }

    // アニメーションの開始
    animationId = requestAnimationFrame(animateFrame)
  })
}
