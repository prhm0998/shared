/**
 *
 * @param obj
 * @param defaultObj
 * @returns defaultObjにのみ存在するpropertyをobjに追加します
 *
 */
export function applyDefaultProperties<T extends object>(obj: Partial<T>, defaultObj: T): T {
  return Object.assign({}, defaultObj, obj)
}