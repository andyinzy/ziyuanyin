import Link from 'next/link'
import { useConfig } from '@/lib/config'
import FormattedDate from '@/components/FormattedDate'
import React from 'react'
import Fade from 'react-reveal/Fade'

const BlogPost = ({ post }) => {
  const BLOG = useConfig()

  return (
    <Fade bottom>
      <Link href={`${BLOG.path}/${post.slug}`}>
        <article key={post.id} className="mt-7 md:mt-10 px-2 py-2 md:px-2.5 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out" >
          <header className="flex flex-col pt-3 justify-between md:flex-row md:items-baseline">
            <h2 className="text-lg md:text-xl font-medium mb-2 ml-4 md:ml-6 pl-2 cursor-pointer text-black dark:text-gray-100">
              {post.title}
            </h2>
            <time className="flex-shrink-0 mx-4 md:mx-6 px-2 text-gray-600 dark:text-gray-400">
              <FormattedDate date={post.date} />
            </time>
          </header>
          <main>
            <p className="hidden md:block pb-4 mx-4 md:mx-6 pl-2 leading-8 text-gray-700 dark:text-gray-300">
              {post.summary}
            </p>
          </main>
        </article>
      </Link>
    </Fade>
  )
}

export default BlogPost
