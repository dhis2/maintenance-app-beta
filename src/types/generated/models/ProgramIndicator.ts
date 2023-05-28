/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AnalyticsPeriodBoundary } from './AnalyticsPeriodBoundary'
import type { AttributeValue } from './AttributeValue'
import type { ObjectStyle } from './ObjectStyle'
import type { QueryModifiers } from './QueryModifiers'
import type { LegendSet } from './LegendSet'
import type { Program } from './Program'
import type { ProgramIndicatorGroup } from './ProgramIndicatorGroup'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ProgramIndicator = {
    access: Access
    aggregateExportAttributeOptionCombo: string
    aggregateExportCategoryOptionCombo: string
    aggregationType: ProgramIndicator.aggregationType
    analyticsPeriodBoundaries: Array<AnalyticsPeriodBoundary>
    analyticsType: ProgramIndicator.analyticsType
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    decimals: number
    description: string
    dimensionItem: string
    displayDescription: string
    displayFormName: string
    displayInForm: boolean
    displayName: string
    displayShortName: string
    expression: string
    favorite: boolean
    favorites: Array<string>
    filter: string
    formName: string
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    legendSet: LegendSet
    legendSets: Array<LegendSet>
    name: string
    orgUnitField: string
    program: Program
    programIndicatorGroups: Array<ProgramIndicatorGroup>
    queryMods: QueryModifiers
    sharing: Sharing
    shortName: string
    style: ObjectStyle
    translations: Array<Translation>
    user: User
}

export namespace ProgramIndicator {
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

    export enum analyticsType {
        EVENT = 'EVENT',
        ENROLLMENT = 'ENROLLMENT',
    }
}
