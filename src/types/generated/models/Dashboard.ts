/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { DashboardItem } from './DashboardItem'
import type { ItemConfig } from './ItemConfig'
import type { Layout } from './Layout'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type Dashboard = {
    access: Access
    allowedFilters: Array<string>
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    dashboardItems: Array<DashboardItem>
    description: string
    displayDescription: string
    displayFormName: string
    displayName: string
    displayShortName: string
    favorite: boolean
    favorites: Array<string>
    formName: string
    href: string
    id: string
    itemConfig: ItemConfig
    itemCount: number
    lastUpdated: string
    lastUpdatedBy: User
    layout: Layout
    name: string
    restrictFilters: boolean
    sharing: Sharing
    shortName: string
    translations: Array<Translation>
    user: User
}
