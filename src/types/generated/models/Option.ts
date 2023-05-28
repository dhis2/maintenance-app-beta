/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { ObjectStyle } from './ObjectStyle'
import type { OptionSet } from './OptionSet'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type Option = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
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
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    optionSet: OptionSet
    sharing: Sharing
    shortName: string
    sortOrder: number
    style: ObjectStyle
    translations: Array<Translation>
    user: User
}
