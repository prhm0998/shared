export function getFixedElementsTotalHeight(): number {
  return Array.from(document.querySelectorAll<HTMLElement>('*'))
    .filter(el => {
      const style = getComputedStyle(el)
      return style.position === 'fixed' && style.top === '0px'
    })
    .reduce((sum, el) => sum + el.offsetHeight, 0)
}