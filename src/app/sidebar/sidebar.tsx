

import classnames from 'classnames'
import React from 'react'
import css from './sidebar.module.css'

interface SidebarProps {
    children?: React.ReactNode
}

export const Sidebar = ({ children }: SidebarProps) => {

    const ContentList = ['Data Elements', 'Categories', 'Organisation Units', 'Data Sets', 'Programs'].map((item, index) => {
        return <li key={index}>{item}</li>
    })
    return <aside className={css.sidebar}>{ContentList}</aside>
}

export default Sidebar
