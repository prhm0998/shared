/**
 *
 * @param int(msec)
 * @description await可能なsleep
 *
 */
export const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec))