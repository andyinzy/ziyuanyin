import PropTypes from 'prop-types'
import Image from 'next/image'
import cn from 'classnames'
import { useConfig } from '@/lib/config'
import useTheme from '@/lib/theme'
import FormattedDate from '@/components/FormattedDate'
import TagItem from '@/components/TagItem'
import NotionRenderer from '@/components/NotionRenderer'
import LayoutCatalog from '@/components/LayoutCatalog'
import React from 'react'
import Fade from 'react-reveal/Fade'

/**
 * A post renderer
 *
 * @param {PostProps} props
 *
 * @typedef {object} PostProps
 * @prop {object}   post       - Post metadata
 * @prop {object}   blockMap   - Post block data
 * @prop {string}   emailHash  - Author email hash (for Gravatar)
 * @prop {boolean} [fullWidth] - Whether in full-width mode
 */
export default function Post (props) {
  const BLOG = useConfig()
  const { post, blockMap, emailHash, fullWidth = false } = props
  const { dark } = useTheme()

  // function isEmptyObject(value) {
  //   console.log('Object is', value);
  //   console.log('Is Object equals null', value===null);
  //   console.log('Object TOC.keys(value).length is', Object.keys(value).length);
  //   console.log('Object value.constructor === Object', value.constructor === Object);
  //   return Object.keys(value).length === 0;
  // }

  return (
    <Fade bottom>
      <article className={cn('flex flex-col selection:bg-neutral-300 selection:bg-black', fullWidth ? 'md:px-24' : 'items-center')}>
        <h1 className={cn(
          'justify-center text-center w-full font-bold text-3xl text-black dark:text-white',
          { 'max-w-2xl px-4': !fullWidth }
        )}>
          {post.title}
        </h1>
        {post.type[0] !== 'Page' && (
          <nav className={cn(
            'w-full flex mt-7 justify-center items-start text-gray-500 dark:text-gray-400',
            { 'max-w-2xl px-4': !fullWidth }
          )}>
            <div className="flex mb-4">
              <a href={BLOG.socialLink || '#'} className="flex">
                <Image
                  alt={BLOG.author}
                  width={30}
                  height={30}
                  src={`https://gravatar.com/avatar/${emailHash}`}
                  className="rounded-full"
                />
                <p className="ml-2 md:block">{BLOG.author}</p>
              </a>
              <span className="block">&nbsp;/&nbsp;</span>
            </div>
            <div className="mr-2 mb-4 md:ml-0">
              <FormattedDate date={post.date} />
            </div>
            {post.tags && (
              <div className="flex flex-nowrap max-w-full px-1 pb-4 overflow-x-auto article-tags">
                {post.tags.map(tag => (
                  <TagItem key={tag} tag={tag} />
                ))}
              </div>
            )}
          </nav>
        )}
        <div className="justify-center self-stretch -mt-4 flex flex-col items-center lg:flex-row lg:items-stretch">
          {/* {!fullWidth && <div className="flex-1 hidden lg:block" />} */}
          <div className={fullWidth ? 'flex-1 pr-4' : 'flex-none w-full max-w-4xl px-4 md:px-14 mt-10 bg-white drop-shadow-xl'}>
            <NotionRenderer recordMap={blockMap} fullPage={false} darkMode={dark} />
          </div>
            <LayoutCatalog blockMap={blockMap} />
          </div>
      </article>
    </Fade>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  blockMap: PropTypes.object.isRequired,
  emailHash: PropTypes.string.isRequired,
  fullWidth: PropTypes.bool
}
