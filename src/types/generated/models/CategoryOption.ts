/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { ObjectStyle } from './ObjectStyle'
import type { QueryModifiers } from './QueryModifiers'
import type { Category } from './Category'
import type { CategoryOptionCombo } from './CategoryOptionCombo'
import type { CategoryOptionGroup } from './CategoryOptionGroup'
import type { LegendSet } from './LegendSet'
import type { OrganisationUnit } from './OrganisationUnit'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type CategoryOption = {
    access: Access
    aggregationType: CategoryOption.aggregationType
    attributeValues: Array<AttributeValue>
    categories: Array<Category>
    categoryOptionCombos: Array<CategoryOptionCombo>
    categoryOptionGroups: Array<CategoryOptionGroup>
    code: string
    created: string
    createdBy: User
    description: string
    dimensionItem: string
    displayDescription: string
    displayFormName: string
    displayName: string
    displayShortName: string
    endDate: string
    favorite: boolean
    favorites: Array<string>
    formName: string
    href: string
    id: string
    isDefault: boolean
    lastUpdated: string
    lastUpdatedBy: User
    legendSet: LegendSet
    legendSets: Array<LegendSet>
    name: string
    organisationUnits: Array<OrganisationUnit>
    queryMods: QueryModifiers
    sharing: Sharing
    shortName: string
    startDate: string
    style: ObjectStyle
    translations: Array<Translation>
    user: User
}

export namespace CategoryOption {
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
}
