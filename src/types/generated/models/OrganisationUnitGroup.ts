/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { QueryModifiers } from './QueryModifiers'
import type { LegendSet } from './LegendSet'
import type { OrganisationUnit } from './OrganisationUnit'
import type { OrganisationUnitGroupSet } from './OrganisationUnitGroupSet'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type OrganisationUnitGroup = {
    access: Access
    aggregationType: OrganisationUnitGroup.aggregationType
    attributeValues: Array<AttributeValue>
    code: string
    color: string
    created: string
    createdBy: User
    description: string
    dimensionItem: string
    displayDescription: string
    displayFormName: string
    displayName: string
    displayShortName: string
    favorite: boolean
    favorites: Array<string>
    featureType: OrganisationUnitGroup.featureType
    formName: string
    geometry: Record<string, any>
    groupSets: Array<OrganisationUnitGroupSet>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    legendSet: LegendSet
    legendSets: Array<LegendSet>
    name: string
    organisationUnits: Array<OrganisationUnit>
    queryMods: QueryModifiers
    sharing: Sharing
    shortName: string
    symbol: string
    translations: Array<Translation>
    user: User
}

export namespace OrganisationUnitGroup {
    export enum aggregationType {
        SUM = 'SUM',
        AVERAGE = 'AVERAGE',
        AVERAGE_SUM_ORG_UNIT = 'AVERAGE_SUM_ORG_UNIT',
        LAST = 'LAST',
        LAST_AVERAGE_ORG_UNIT = 'LAST_AVERAGE_ORG_UNIT',
        LAST_LAST_ORG_UNIT = 'LAST_LAST_ORG_UNIT',
        LAST_IN_PERIOD = 'LAST_IN_PERIOD',
        LAST_IN_PERIOD_AVERAGE_ORG_UNIT = 'LAST_IN_PERIOD_AVERAGE_ORG_UNIT',
        FIRST = 'FIRST',
        FIRST_AVERAGE_ORG_UNIT = 'FIRST_AVERAGE_ORG_UNIT',
        FIRST_FIRST_ORG_UNIT = 'FIRST_FIRST_ORG_UNIT',
        COUNT = 'COUNT',
        STDDEV = 'STDDEV',
        VARIANCE = 'VARIANCE',
        MIN = 'MIN',
        MAX = 'MAX',
        MIN_SUM_ORG_UNIT = 'MIN_SUM_ORG_UNIT',
        MAX_SUM_ORG_UNIT = 'MAX_SUM_ORG_UNIT',
        NONE = 'NONE',
        CUSTOM = 'CUSTOM',
        DEFAULT = 'DEFAULT',
    }

    export enum featureType {
        NONE = 'NONE',
        MULTI_POLYGON = 'MULTI_POLYGON',
        POLYGON = 'POLYGON',
        POINT = 'POINT',
        SYMBOL = 'SYMBOL',
    }
}
