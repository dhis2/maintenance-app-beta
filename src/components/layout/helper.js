import { Children } from 'react'
import { TopBar } from './TopBar'
import { SideBar } from './SideBar'

export const childrenContainsComponent = component => children =>
    !!Children.toArray(children).find(({ type }) => type === component)

export const childrenContainsTopBar = childrenContainsComponent(TopBar)
export const childrenContainsSideBar = childrenContainsComponent(SideBar)
