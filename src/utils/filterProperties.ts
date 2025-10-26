/**
 *
 * @param obj
 * @param defaultObj
 * @returns objectからdefaultObjectに存在しないプロパティを削除します
 *
 */
export function filterProperties<T extends object>(obj: Partial<T>, defaultObj: T): Partial<T> {
  return Object.keys(defaultObj).reduce((acc, key) => {
    if (key in obj) {
      acc[key as keyof T] = obj[key as keyof T]!
    }
    return acc
  }, {} as Partial<T>)
}