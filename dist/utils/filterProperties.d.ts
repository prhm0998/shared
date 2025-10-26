/**
 *
 * @param obj
 * @param defaultObj
 * @returns objectからdefaultObjectに存在しないプロパティを削除します
 *
 */
export declare function filterProperties<T extends object>(obj: Partial<T>, defaultObj: T): Partial<T>;
