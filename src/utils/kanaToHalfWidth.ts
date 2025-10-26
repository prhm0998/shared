/**
 *
 * @param str
 * @returns カタカナを全角にします
 *
 */
export function kanaToHalfWidth(str: string) {
  // 濁音・半濁音
  const D_MUD = 'ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴヷヺ'
  const S_MUD = 'ｶﾞｷﾞｸﾞｹﾞｺﾞｻﾞｼﾞｽﾞｾﾞｿﾞﾀﾞﾁﾞﾂﾞﾃﾞﾄﾞﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟｳﾞﾜﾞｦﾞ'
  // 清音・記号
  const D_KIY = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ'
    + 'マミムメモヤユヨラリルレロワヲンァィゥェォッャュョ。、ー「」・'
  const S_KIY = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮ｡､ｰ｢｣･'

  const map: { [key: string]: string } = {}
  // 濁音・半濁音の対応を作成（全角→半角）
  for (let i = 0, len = D_MUD.length; i < len; i++) {
    map[D_MUD.slice(i, i + 1)] = S_MUD.slice(i * 2, i * 2 + 2)
  }
  // 清音・記号の対応を作成（全角→半角）
  for (let i = 0, len = D_KIY.length; i < len; i++) {
    map[D_KIY.slice(i, i + 1)] = S_KIY.slice(i, i + 1)
  }

  const re = new RegExp(Object.keys(map).join('|'), 'g')

  return str.replace(re, (x: string) => map[x])
}
