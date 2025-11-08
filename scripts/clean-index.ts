import fs from 'fs'
import path from 'path'

// プロジェクトのルートディレクトリからの相対パスで削除対象を指定
const filesToDelete: string[] = [
  'src/index.ts',
  'src/composables/index.ts',
  'src/utils/index.ts',
  'src/pinia/index.ts',
]

for (const filePath of filesToDelete) {
  const fullPath = path.resolve(filePath)
  try {
    // ファイルが存在するか確認
    if (fs.existsSync(fullPath)) {
      // ファイルを削除
      fs.unlinkSync(fullPath)
    }
    else {
      console.log(`⚠️ ファイルが見つかりません: ${filePath}`)
    }
  }
  catch (err) {
    console.error(`❌ 削除中にエラーが発生しました ${filePath}:`, err)
  }
}