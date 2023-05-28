/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { Dashboard } from './Dashboard'
import type { User } from './User'
import type { UserGroup } from './UserGroup'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type PushAnalysis = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    dashboard: Dashboard
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    message: string
    name: string
    recipientUserGroups: Array<UserGroup>
    sharing: Sharing
    title: string
    translations: Array<Translation>
    user: User
}
