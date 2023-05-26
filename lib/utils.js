/**
 * 封装异步加载资源的方法，可以用于按需加载外部资源，提高页面加载速度和性能
 * @param url 地址 例如 https://xx.com/xx.js
 * @param type js 或 css
 * @returns {Promise<unknown>}
 */
export function loadExternalResource(url, type) {
  return new Promise((resolve, reject) => {
    let tag

    if (type === 'css') {
      tag = document.createElement('link')
      tag.rel = 'stylesheet'
      tag.href = url
    } else if (type === 'font') {
      tag = document.createElement('link')
      tag.rel = 'preload'
      tag.as = 'font'
      tag.href = url
    } else if (type === 'js') {
      tag = document.createElement('script')
      tag.src = url
    }
    if (tag) {
      tag.onload = () => resolve(url)
      tag.onerror = () => reject(url)
      document.head.appendChild(tag)
    }
  })
}