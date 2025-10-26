// check-src.ts
import fs from 'fs'
import path from 'path'

// 出力先のファイル名と、見つかったファイルリストの型を定義
const OUTPUT_FILE: string = 'file-list-src.txt'
const fileList: string[] = []

/**
 * 指定されたディレクトリ以下のファイルを再帰的に検索し、fileList にパスを追加します。
 * @param dir - 検索を開始するディレクトリパス (string型)
 */
function walk(dir: string): void {
  try {
    // fs.readdirSync の結果は string[]
    const files: string[] = fs.readdirSync(dir)

    files.forEach((file: string) => {
      // fullPath は string型
      const fullPath: string = path.join(dir, file)
      // fs.statSync の結果は fs.Stats型
      const stat: fs.Stats = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        walk(fullPath)
      } else {
        // コンソールにも出力
        console.log(fullPath)
        // 配列に追加 (string型を string[] に push)
        fileList.push(fullPath)
      }
    })
  } catch (err) {
    // エラーは unknown または any としてキャッチされることが一般的ですが、
    // ここでは console.error に渡すため、そのまま使用します。
    console.error(`エラー: ディレクトリ ${dir} の読み取りに失敗しました。`, err)
  }
}

// 検索を開始
walk('./src')

// 検索終了後、結果をファイルに書き込む
if (fileList.length > 0) {
  try {
    // fs.writeFileSync の第一引数は string または Buffer、第二引数は string, Buffer, または Uint8Array
    fs.writeFileSync(OUTPUT_FILE, fileList.join('\n') + '\n')
    console.log(`\n✅ ファイルリストが ${OUTPUT_FILE} に正常に出力されました。`)
  } catch (err) {
    console.error(`\n❌ ファイル ${OUTPUT_FILE} への書き込みに失敗しました。`, err)
  }
} else {
  console.log('\n⚠️ ファイルが見つかりませんでした。')
}