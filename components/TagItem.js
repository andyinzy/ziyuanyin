import Link from 'next/link'

const TagItem = ({ tag }) => (
  <Link href={`/tag/${encodeURIComponent(tag)}`}>
    <p className="mx-1 rounded-xl px-2 py-1 custom-page-tag-hover-shadow border leading-none text-sm dark:border-gray-600">
      {tag}
    </p>
  </Link>
)

export default TagItem
