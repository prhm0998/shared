// 文字列を受け取り、半角英数字を全角に変換する関数
export function latinToZenkaku(text: string): string {
  return text.replace(/[0-9A-Za-z]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) + 65248) // 全角へ変換
  })
}