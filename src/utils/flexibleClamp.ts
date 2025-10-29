interface FlexibleClampOption {
  min?: number
  max?: number
}
export function flexibleClamp(value: number, option: FlexibleClampOption = {}) {
  const {
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
  } = option
  return Math.min(Math.max(value, min), max)
}
