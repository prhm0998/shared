import { hiraToKana } from './hiraToKana'
import { kanaToFullWidth } from './kanaToFullWidth'

/**
 *
 * @param key: string
 * @returns ｶﾅ/ひらがな/カタカナをすべてカタカナにします
 */
export const normalizedWord = (key: string = '') => kanaToFullWidth(hiraToKana(key))