/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { ObjectStyle } from './ObjectStyle'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { TrackedEntityTypeAttribute } from './TrackedEntityTypeAttribute'
import type { Translation } from './Translation'

export type TrackedEntityType = {
    access: Access
    allowAuditLog: boolean
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
    featureType: TrackedEntityType.featureType
    formName: string
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    maxTeiCountToReturn: number
    minAttributesRequiredToSearch: number
    name: string
    sharing: Sharing
    shortName: string
    style: ObjectStyle
    trackedEntityTypeAttributes: Array<TrackedEntityTypeAttribute>
    translations: Array<Translation>
    user: User
}

export namespace TrackedEntityType {
    export enum featureType {
        NONE = 'NONE',
        MULTI_POLYGON = 'MULTI_POLYGON',
        POLYGON = 'POLYGON',
        POINT = 'POINT',
        SYMBOL = 'SYMBOL',
    }
}
