const cusdisI18n = [
  'ca',
  'en',
  'es',
  'fi',
  'fr',
  'id',
  'ja',
  'oc',
  'pt-br',
  'tr',
  'zh-cn',
  'zh-tw'
]
// @ default function fetchCusdisLang:
// @ I change this cause I need to show up Chinese in my blog.
// export const fetchCusdisLang = lang => {
//   const loweredLang = lang.toLowerCase()
//   if (loweredLang.startsWith('zh')) {
//     return (
//       cusdisI18n.find(i => loweredLang === i.toLocaleLowerCase()) ?? 'zh-cn'
//     )
//   } else {
//     return (
//       cusdisI18n.find(i =>
//         loweredLang.startsWith(i.toLowerCase())
//       ) ?? 'en'
//     )
//   }
// }

// ONLY SHOW UP IN CHINESE
export const fetchCusdisLang = lang => {
  const loweredLang = lang.toLowerCase()
  return (
    cusdisI18n.find(i => loweredLang === i.toLocaleLowerCase()) ?? 'zh-cn'
  )
}