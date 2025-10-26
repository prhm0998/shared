/**
 * 指定した要素以下のすべてのテキストノードに対して callback を実行する
 *
 * @param element - 対象のルート要素
 * @param callback - 各 textContent に適用する関数
 */
export function traverseTextNodes(
  element: Element,
  callback: (text: string) => string
): void {
  const iterator = document.createNodeIterator(
    element,
    NodeFilter.SHOW_TEXT,
    null
  )

  let node: Node | null
  while ((node = iterator.nextNode())) {
    node.textContent = callback(node.textContent ?? '')
  }
}
