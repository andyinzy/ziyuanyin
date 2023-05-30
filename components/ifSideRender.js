import React, { useRef } from 'react'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { getPageTableOfContents } from 'notion-utils'
import PropTypes from 'prop-types'


/**
 * 目录导航组件判空函数
 * @param boolean
 * @returns {JSX.Element}
 * @constructor
 */

export default function ifSideRender({ blockMap }) {
    const nodes = getPageTableOfContents(page, blockMap)
    // 无目录直接返回 True
    if (!nodes.length) return false
    return true
}