// check-dist.ts

import fs from 'fs'
import path from 'path'

// ファイルリストの型は残します
const fileList: string[] = []

// ★ OUTPUT_FILE の定義を削除

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
      }
      else {
        // コンソールにも出力
        console.log(fullPath)
        // 配列に追加 (string型を string[] に push)
        fileList.push(fullPath)
      }
    })
  }
  catch (err) {
    // エラーは unknown または any としてキャッチされることが一般的ですが、
    // ここでは console.error に渡すため、そのまま使用します。
    console.error(`エラー: ディレクトリ ${dir} の読み取りに失敗しました。`, err)
  }
}

// --------------------------------------------------
// コマンドライン引数から対象ディレクトリを取得するロジック (前回の修正)
// --------------------------------------------------

const targetDir: string | undefined = process.argv[2]

if (!targetDir) {
  // 引数が指定されなかった場合のエラー処理
  console.error('\n❌ エラー: 検索対象のディレクトリを指定してください。')
  console.log('💡 使用法: jiti scripts/check-dist <対象ディレクトリ>')
  process.exit(1)
}

// --------------------------------------------------
// ★変更点：対象ディレクトリ名を使って出力ファイル名を動的に決定
// --------------------------------------------------
// 例: targetDir が "build" の場合、OUTPUT_FILE は "file-list-build.txt" になります。
const OUTPUT_FILE: string = `file-list-${targetDir}.txt`

console.log(`\n🔍 ディレクトリ「${targetDir}」以下のファイルを検索します...`)

// 検索を開始
walk(targetDir)

// --------------------------------------------------
// 既存のファイル書き込みロジック (OUTPUT_FILE の利用箇所を修正)
// --------------------------------------------------

// ✅ 階層の浅いファイルを優先して並び替え
fileList.sort((a, b) => {
  const depthDiff = a.split(path.sep).length - b.split(path.sep).length
  return depthDiff !== 0 ? depthDiff : a.localeCompare(b)
})

// 出力
if (fileList.length > 0) {
  try {
    // fs.writeFileSync の第一引数は string または Buffer、第二引数は string, Buffer, または Uint8Array
    fs.writeFileSync(OUTPUT_FILE, fileList.join('\n') + '\n')
    // コンソール出力も変更
    console.log(`\n✅ ファイルリストが ${OUTPUT_FILE} に正常に出力されました。`)
  }
  catch (err) {
    console.error(`\n❌ ファイル ${OUTPUT_FILE} への書き込みに失敗しました。`, err)
  }
}
else {
  console.log('\n⚠️ ファイルが見つかりませんでした。')
}