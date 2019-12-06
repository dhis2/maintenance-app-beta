import { Children } from 'react'
import cx from 'classnames'

import { TopBar } from './TopBar'
import { SideBar } from './SideBar'
import styles from './Container.module.css'

export const childrenContainsComponent = component => children =>
    !!Children.toArray(children).find(({ type }) => type === component)

export const childrenContainsTopBar = childrenContainsComponent(TopBar)
export const childrenContainsSideBar = childrenContainsComponent(SideBar)

export const determineClassName = children => {
    const withSidebar = childrenContainsSideBar(children)
    const withTopBar = childrenContainsTopBar(children)

    return cx(styles.container, {
        [styles.withSidebar]: withSidebar,
        [styles.withTopBar]: withTopBar,
    })
}
