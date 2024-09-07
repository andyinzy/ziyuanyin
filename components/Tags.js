import Link from 'next/link'

const Tags = ({ tags, currentTag }) => {
  if (!tags) return null
  return (
    <div className="tag-container">
      <ul className="flex max-w-full mt-4 overflow-x-auto pb-8">
        {Object.keys(tags).map(key => {
          const selected = key === currentTag
          return (
            <li
              key={key}
              className={`mr-3 font-medium border whitespace-nowrap dark:text-gray-300 ${
                selected
                  ? 'custom-rsch-tag-selected'
                  : 'bg-gray-100 border-gray-100 text-gray-800'
              }`}
            >
              <Link
                key={key}
                href={selected ? '/search' : `/tag/${encodeURIComponent(key)}`}
                className="px-2 py-1 block custom-rsch-tag-hover-shadow"
              >
                {`${key} (${tags[key]})`}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Tags
