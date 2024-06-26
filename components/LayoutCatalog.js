import React, { useRef } from 'react'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { getPageTableOfContents } from 'notion-utils'
import PropTypes from 'prop-types'

/**
 * 目录导航组件
 * @param toc
 * @returns {JSX.Element}
 * @constructor
 */
export default function LayoutCatalog ({ blockMap, setHasToc }) {
  const collectionId = Object.keys(blockMap.collection)[0]
  const page = Object.values(blockMap.block).find(block => block.value.parent_id === collectionId).value
  const nodes = getPageTableOfContents(page, blockMap)
  var ifSideRender = true

  // 监听滚动事件
  React.useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy)
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [])

  // 检查是否有目录节点，返回给Post.js
  React.useEffect(() => {
    const hasTableOfContents  = nodes && nodes.length > 0;
    setHasToc(hasTableOfContents );
  }, [nodes, setHasToc]);
  

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
    const top = index > 0 ? 38 * index - 38 : 0;
    tRef?.current?.scrollTo({ top , behavior: 'smooth' })
  }, throttleMs))

  // 无目录就直接返回空
  if (!nodes.length) {
    ifSideRender = false
    return null
  }

  /**
   * @param {string} id - The ID of target heading block (could be in UUID format)
   */
  function scrollTo (id) {
    id = id.replaceAll('-', '')
    const target = document.querySelector(`.notion-block-${id}`)
    if (!target) return
    // `65` is the height of expanded nav
    // TODO: Remove the magic number
    const top = document.documentElement.scrollTop + target.getBoundingClientRect().top - 65
    document.documentElement.scrollTo({
      top,
      behavior: 'smooth'
    })
  }

  return (
  <div className = {`${ifSideRender ? 'order-first lg:order-[unset] w-full lg:w-auto max-w-sm lg:max-w-md lg:min-w-[180px]' : 'hidden'}`}>
    <div className='px-3 lg:mx-10 mt-10 pb-8 font-serif sticky top-24 select-none border rounded-sm lg:p-6 p-4 hidden lg:block lg:w-96 bg-white drop-shadow-xl'>
{/* <p className="text-center sticky font-bold text-black block pt-2 mb-5 hover:text-black dark:text-white cursor-default">
  目录
</p> */}
        <div className="sticky text-center font-bold text-black mt-1 mb-8">
          <span>目 录</span>
        </div>
        
    {/* <aside className='font-serif flex-auto ml-4 md:ml-12 mt-10 pl-2 md:pl-5 md:border-l-2 border-gray-200 text-sm text-zinc-700/70 dark:text-neutral-400 select-none' style={style}> */}
        <div className='overflow-y-auto max-h-52 min-w-sm max-w-sm lg:max-h-96 overscroll-none scroll-smooth scroll-py-4 scroll-hidden overflow-hidden auto-hidden-scrollbar truncate' ref={tRef}>
          <nav className='h-full text-black dark:text-gray-300'>
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
              ))} */}
            {nodes.map((node) => {
              const id = uuidToId(node.id)
              tocIds.push(id)
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`z-40 mb-1.5 mx-1 notion-aside-table-of-contents-item transition duration-300 ease-in-out font-normal
                  notion-table-of-contents-item-indent-level-${node.indentLevel}
                  ${activeSection === id && 'bg-white font-bold text-black'}`}
                  onClick={() => scrollTo(node.id)}
                >
                  <span style={{ display: 'inline-block', marginLeft: node.indentLevel * 20 }}  className={`
                    ${activeSection === id && 'font-bold text-black'}
                    ${node.text.length > 14 ? 'truncate' : ' '}
                      `}>
                    {node.text}
                  </span>
                </a>
              )
            })}
          </nav>
        </div>
    </div>
  </div>
)}

LayoutCatalog.propTypes = {
  blockMap: PropTypes.object.isRequired,
  setHasToc: PropTypes.func.isRequired,
}

// export default Toc
