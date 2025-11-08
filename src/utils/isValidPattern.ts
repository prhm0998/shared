import { matchPattern } from 'browser-extension-url-match'

export function isValidPattern(pattern: string): boolean {
  return matchPattern(pattern).valid
}