import PropTypes from 'prop-types'
import { getPageTableOfContents } from 'notion-utils'
import cn from 'classnames'

export default function TableOfContents ({ blockMap, className, style }) {
  const collectionId = Object.keys(blockMap.collection)[0]
  const page = Object.values(blockMap.block).find(block => block.value.parent_id === collectionId).value
  const nodes = getPageTableOfContents(page, blockMap)

  if (!nodes.length) return null

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
    <aside
      className={cn(className, 'font-serif flex-auto ml-4 md:ml-12 mt-10 pl-2 md:pl-5 md:border-l-2 border-gray-200 text-sm text-zinc-700/70 dark:text-neutral-400 select-none text-ellipsis')}
      style={style}
    >
      <div>
          <p class="text-left font-bold text-black block py-1 hover:text-black dark:text-white cursor-default">
            目录 {/* 改进：双语、和id绑定 */}
          </p>
        </div>
      {nodes.map(node => (
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
      ))}
    </aside>
  )
}

TableOfContents.propTypes = {
  blockMap: PropTypes.object.isRequired
}
