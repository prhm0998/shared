import { hiraToKana } from "./hiraToKana";
import { kanaToFullWidth } from "./kanaToFullWidth";

/**
 *
 * @param key
 * @returns 半角ｶﾅを全角カナに、ひらがなをカタカナに
 */
export const normalizedWord = (key: string = '') => kanaToFullWidth(hiraToKana(key))