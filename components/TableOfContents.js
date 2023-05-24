import React, { useRef } from 'react'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { getPageTableOfContents } from 'notion-utils'
import PropTypes from 'prop-types'
import cn from 'classnames'

/**
 * 目录导航组件
 * @param toc
 * @returns {JSX.Element}
 * @constructor
 */
const Toc = ({ toc }) => {
  // 监听滚动事件
  React.useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy)
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [])

  // 目录自动滚动
  const tRef = useRef(null)
  const tocIds = []

  // 同步选中目录事件
  const [activeSection, setActiveSection] = React.useState(null)
  const throttleMs = 200
  const actionSectionScrollSpy = React.useCallback(throttle(() => {
    const sections = document.getElementsByClassName('notion-h')
    let prevBBox = null
    let currentSectionId = activeSection
    for (let i = 0; i < sections.length; ++i) {
      const section = sections[i]
      if (!section || !(section instanceof Element)) continue
      if (!currentSectionId) {
        currentSectionId = section.getAttribute('data-id')
      }
      const bbox = section.getBoundingClientRect()
      const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
      const offset = Math.max(150, prevHeight / 4)
      // GetBoundingClientRect returns values relative to viewport
      if (bbox.top - offset < 0) {
        currentSectionId = section.getAttribute('data-id')
        prevBBox = bbox
        continue
      }
      // No need to continue loop, if last element has been detected
      break
    }
    setActiveSection(currentSectionId)
    const index = tocIds.indexOf(currentSectionId) || 0
    tRef?.current?.scrollTo({ top: 28 * index, behavior: 'smooth' })
  }, throttleMs))

// 无目录就直接返回空
if (!toc || toc.length < 1) {
  return <></>
}


// export default function TableOfContents ({ blockMap, className, style }) {
//   const collectionId = Object.keys(blockMap.collection)[0]
//   const page = Object.values(blockMap.block).find(block => block.value.parent_id === collectionId).value
//   const nodes = getPageTableOfContents(page, blockMap)

//   if (!nodes.length) return null

//   /**
//    * @param {string} id - The ID of target heading block (could be in UUID format)
//    */
//   function scrollTo (id) {
//     id = id.replaceAll('-', '')
//     const target = document.querySelector(`.notion-block-${id}`)
//     if (!target) return
//     // `65` is the height of expanded nav
//     // TODO: Remove the magic number
//     const top = document.documentElement.scrollTop + target.getBoundingClientRect().top - 65
//     document.documentElement.scrollTo({
//       top,
//       behavior: 'smooth'
//     })
//   }

  return (
    <aside
      className={cn(className, 'font-serif flex-auto overflow-y-auto max-h-96 overscroll-none scroll-hidden ml-4 md:ml-12 mt-10 pl-2 md:pl-5 md:border-l-2 border-gray-200 text-sm text-zinc-700/70 dark:text-neutral-400 select-none text-ellipsis')}
      style={style}
      ref={tRef}
    >
      <div>
          <p class="text-left font-bold text-black block py-1 hover:text-black dark:text-white cursor-default">
            目录 {/* 改进：双语、和id绑定 */}
          </p>
        </div>
      {/* {nodes.map(node => (
        <div key={node.id}>
          <a
            data-target-id={node.id}
            className="block py-1 pl-4 no-underline hover:underline hover:underline-offset-8 hover:decoration-2 hover:text-black dark:hover:text-white cursor-pointer transition duration-200"
            style={{ paddingLeft: (node.indentLevel * 24) + 'px' }}
            onClick={() => scrollTo(node.id)}
          >
            {node.text}
          </a>
        </div>
      ))} */
      toc.map((tocItem) => {
        const id = uuidToId(tocItem.id)
        tocIds.push(id)
        return (
          <a
            key={id}
            href={`#${id}`}
            className={`notion-table-of-contents-item duration-300 transform font-light
            notion-table-of-contents-item-indent-level-${tocItem.indentLevel} `}
          >
            <span style={{ display: 'inline-block', marginLeft: tocItem.indentLevel * 16 }} className={`${activeSection === id && ' font-bold text-red-400 underline'}`}>
              {tocItem.text}
            </span>
          </a>
        )
      })}
    </aside>
  )
}

// TableOfContents.propTypes = {
//   blockMap: PropTypes.object.isRequired
// }
export default Toc