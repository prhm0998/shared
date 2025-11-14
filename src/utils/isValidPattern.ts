import { matchPattern } from 'browser-extension-url-match'

/**
 *
 * browser-extension-url-matchを使用してpattern文字列を照合します
 *
 * @param pattern
 * @returns boolean
 */
export function isValidPattern(pattern: string): boolean {
  return matchPattern(pattern).valid
}