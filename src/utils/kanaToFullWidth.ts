/**
 *
 * @param str
 * @returns ひらがな・カタカナを全角にします
 *
 */
// https://qiita.com/noenture/items/8cb7b62c78be5c092564
export function kanaToFullWidth(str: string) {
  //muddy
  const D_MUD = 'ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴヷヺ'
  const S_MUD = 'ｶﾞｷﾞｸﾞｹﾞｺﾞｻﾞｼﾞｽﾞｾﾞｿﾞﾀﾞﾁﾞﾂﾞﾃﾞﾄﾞﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟｳﾞﾜﾞｦﾞ'
  //kiyone
  const D_KIY = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ'
    + 'マミムメモヤユヨラリルレロワヲンァィゥェォッャュョ。、ー「」・'
  const S_KIY = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮ｡､ｰ｢｣･'
  const map: { [key: string]: string } = {}
  for (let i = 0, len = D_MUD.length; i < len; i++) {
    map[S_MUD.slice(i * 2, i * 2 + 2)] = D_MUD.slice(i, i + 1)
  }
  for (let i = 0, len = D_KIY.length; i < len; i++) {
    map[S_KIY.slice(i, i + 1)] = D_KIY.slice(i, i + 1)
  }
  const re = new RegExp(Object.keys(map).join('|'), 'g')

  return str.replace(re, (x: string) => map[x])
}