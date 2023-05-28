/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { ObjectStyle } from './ObjectStyle'
import type { QueryModifiers } from './QueryModifiers'
import type { DataSet } from './DataSet'
import type { IndicatorGroup } from './IndicatorGroup'
import type { IndicatorType } from './IndicatorType'
import type { LegendSet } from './LegendSet'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type Indicator = {
    access: Access
    aggregateExportAttributeOptionCombo: string
    aggregateExportCategoryOptionCombo: string
    aggregationType: Indicator.aggregationType
    annualized: boolean
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    dataSets: Array<DataSet>
    decimals: number
    denominator: string
    denominatorDescription: string
    description: string
    dimensionItem: string
    displayDenominatorDescription: string
    displayDescription: string
    displayFormName: string
    displayName: string
    displayNumeratorDescription: string
    displayShortName: string
    explodedDenominator: string
    explodedNumerator: string
    favorite: boolean
    favorites: Array<string>
    formName: string
    href: string
    id: string
    indicatorGroups: Array<IndicatorGroup>
    indicatorType: IndicatorType
    lastUpdated: string
    lastUpdatedBy: User
    legendSet: LegendSet
    legendSets: Array<LegendSet>
    name: string
    numerator: string
    numeratorDescription: string
    queryMods: QueryModifiers
    sharing: Sharing
    shortName: string
    style: ObjectStyle
    translations: Array<Translation>
    url: string
    user: User
}

export namespace Indicator {
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
