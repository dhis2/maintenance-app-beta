/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type SqlView = {
    access: Access
    attributeValues: Array<AttributeValue>
    cacheStrategy: SqlView.cacheStrategy
    code: string
    created: string
    createdBy: User
    description: string
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    sharing: Sharing
    sqlQuery: string
    translations: Array<Translation>
    type: SqlView.type
    updateJobId: string
    user: User
}

export namespace SqlView {
    export enum cacheStrategy {
        NO_CACHE = 'NO_CACHE',
        CACHE_1_MINUTE = 'CACHE_1_MINUTE',
        CACHE_5_MINUTES = 'CACHE_5_MINUTES',
        CACHE_10_MINUTES = 'CACHE_10_MINUTES',
        CACHE_15_MINUTES = 'CACHE_15_MINUTES',
        CACHE_30_MINUTES = 'CACHE_30_MINUTES',
        CACHE_1_HOUR = 'CACHE_1_HOUR',
        CACHE_6AM_TOMORROW = 'CACHE_6AM_TOMORROW',
        CACHE_TWO_WEEKS = 'CACHE_TWO_WEEKS',
        RESPECT_SYSTEM_SETTING = 'RESPECT_SYSTEM_SETTING',
    }

    export enum type {
        VIEW = 'VIEW',
        MATERIALIZED_VIEW = 'MATERIALIZED_VIEW',
        QUERY = 'QUERY',
    }
}
