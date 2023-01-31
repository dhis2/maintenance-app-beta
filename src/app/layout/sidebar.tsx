
import classnames from 'classnames'
import { node, bool } from 'prop-types'
import React from 'react'
import css from './sidebar.module.css'

const Sidebar = ({ children, showSidebar }) => {
    const sidebarClass = classnames(css.sidebar, {
        [css.showSidebar]: showSidebar,
    })

    const ContentList = ['Data Elements', 'Categories', 'Organisation Units', 'Data Sets', 'Programs'].map((item, index) => {
        return <li key={index}>{item}</li>
    })
    return <aside className={sidebarClass}>{ContentList}</aside>
}

Sidebar.propTypes = {
    children: node,
    showSidebar: bool,
}

export default Sidebar