export function scrollWithFixedOffset(el: HTMLElement, offset: number) {
  const rect = el.getBoundingClientRect()
  const scrollTop = window.scrollY + rect.top - offset
  window.scrollTo({ top: scrollTop, behavior: 'smooth' })
}