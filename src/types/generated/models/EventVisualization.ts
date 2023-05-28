/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { CategoryDimension } from './CategoryDimension'
import type { CategoryOptionGroupSetDimension } from './CategoryOptionGroupSetDimension'
import type { DataDimensionItem } from './DataDimensionItem'
import type { DataElementGroupSetDimension } from './DataElementGroupSetDimension'
import type { EventRepetition } from './EventRepetition'
import type { LegendDefinitions } from './LegendDefinitions'
import type { OrganisationUnitGroupSetDimension } from './OrganisationUnitGroupSetDimension'
import type { DataElement } from './DataElement'
import type { DimensionalItemObject } from './DimensionalItemObject'
import type { DimensionalObject } from './DimensionalObject'
import type { Interpretation } from './Interpretation'
import type { OrganisationUnit } from './OrganisationUnit'
import type { OrganisationUnitGroup } from './OrganisationUnitGroup'
import type { Program } from './Program'
import type { ProgramStage } from './ProgramStage'
import type { TrackedEntityAttribute } from './TrackedEntityAttribute'
import type { User } from './User'
import type { RelativePeriods } from './RelativePeriods'
import type { Sharing } from './Sharing'
import type { SimpleDimension } from './SimpleDimension'
import type { TrackedEntityAttributeDimension } from './TrackedEntityAttributeDimension'
import type { TrackedEntityDataElementDimension } from './TrackedEntityDataElementDimension'
import type { TrackedEntityProgramIndicatorDimension } from './TrackedEntityProgramIndicatorDimension'
import type { Translation } from './Translation'

export type EventVisualization = {
    access: Access
    aggregationType: EventVisualization.aggregationType
    attributeDimensions: Array<TrackedEntityAttributeDimension>
    attributeValueDimension: TrackedEntityAttribute
    attributeValues: Array<AttributeValue>
    baseLineLabel: string
    baseLineValue: number
    categoryDimensions: Array<CategoryDimension>
    categoryOptionGroupSetDimensions: Array<CategoryOptionGroupSetDimension>
    code: string
    colSubTotals: boolean
    colTotals: boolean
    collapseDataDimensions: boolean
    columnDimensions: Array<string>
    columns: Array<DimensionalObject>
    completedOnly: boolean
    created: string
    createdBy: User
    cumulativeValues: boolean
    dataDimensionItems: Array<DataDimensionItem>
    dataElementDimensions: Array<TrackedEntityDataElementDimension>
    dataElementGroupSetDimensions: Array<DataElementGroupSetDimension>
    dataElementValueDimension: DataElement
    dataType: EventVisualization.dataType
    description: string
    digitGroupSeparator: EventVisualization.digitGroupSeparator
    displayBaseLineLabel: string
    displayDensity: EventVisualization.displayDensity
    displayDescription: string
    displayDomainAxisLabel: string
    displayFormName: string
    displayName: string
    displayRangeAxisLabel: string
    displayShortName: string
    displaySubtitle: string
    displayTargetLineLabel: string
    displayTitle: string
    domainAxisLabel: string
    endDate: string
    eventStatus: EventVisualization.eventStatus
    favorite: boolean
    favorites: Array<string>
    filterDimensions: Array<string>
    filters: Array<DimensionalObject>
    fontSize: EventVisualization.fontSize
    formName: string
    hideEmptyRowItems: EventVisualization.hideEmptyRowItems
    hideEmptyRows: boolean
    hideLegend: boolean
    hideNaData: boolean
    hideSubtitle: boolean
    hideTitle: boolean
    href: string
    id: string
    interpretations: Array<Interpretation>
    itemOrganisationUnitGroups: Array<OrganisationUnitGroup>
    lastUpdated: string
    lastUpdatedBy: User
    legacy: boolean
    legend: LegendDefinitions
    name: string
    noSpaceBetweenColumns: boolean
    orgUnitField: string
    organisationUnitGroupSetDimensions: Array<OrganisationUnitGroupSetDimension>
    organisationUnitLevels: Array<number>
    organisationUnits: Array<OrganisationUnit>
    outputType: EventVisualization.outputType
    parentGraphMap: Record<string, string>
    percentStackedValues: boolean
    periods: Array<string>
    program: Program
    programIndicatorDimensions: Array<TrackedEntityProgramIndicatorDimension>
    programStage: ProgramStage
    programStatus: EventVisualization.programStatus
    rangeAxisDecimals: number
    rangeAxisLabel: string
    rangeAxisMaxValue: number
    rangeAxisMinValue: number
    rangeAxisSteps: number
    regressionType: EventVisualization.regressionType
    relativePeriods: RelativePeriods
    repetitions: Array<EventRepetition>
    rowDimensions: Array<string>
    rowSubTotals: boolean
    rowTotals: boolean
    rows: Array<DimensionalObject>
    sharing: Sharing
    shortName: string
    showData: boolean
    showDimensionLabels: boolean
    showHierarchy: boolean
    simpleDimensions: Array<SimpleDimension>
    sortOrder: number
    startDate: string
    subscribed: boolean
    subscribers: Array<string>
    subtitle: string
    targetLineLabel: string
    targetLineValue: number
    timeField: string
    title: string
    topLimit: number
    translations: Array<Translation>
    type: EventVisualization.type
    user: User
    userOrgUnitType: EventVisualization.userOrgUnitType
    userOrganisationUnit: boolean
    userOrganisationUnitChildren: boolean
    userOrganisationUnitGrandChildren: boolean
    value: DimensionalItemObject
}

export namespace EventVisualization {
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

    export enum dataType {
        AGGREGATED_VALUES = 'AGGREGATED_VALUES',
        EVENTS = 'EVENTS',
    }

    export enum digitGroupSeparator {
        COMMA = 'COMMA',
        SPACE = 'SPACE',
        NONE = 'NONE',
    }

    export enum displayDensity {
        COMFORTABLE = 'COMFORTABLE',
        NORMAL = 'NORMAL',
        COMPACT = 'COMPACT',
        NONE = 'NONE',
    }

    export enum eventStatus {
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
        VISITED = 'VISITED',
        SCHEDULE = 'SCHEDULE',
        OVERDUE = 'OVERDUE',
        SKIPPED = 'SKIPPED',
    }

    export enum fontSize {
        LARGE = 'LARGE',
        NORMAL = 'NORMAL',
        SMALL = 'SMALL',
    }

    export enum hideEmptyRowItems {
        NONE = 'NONE',
        BEFORE_FIRST = 'BEFORE_FIRST',
        AFTER_LAST = 'AFTER_LAST',
        BEFORE_FIRST_AFTER_LAST = 'BEFORE_FIRST_AFTER_LAST',
        ALL = 'ALL',
    }

    export enum outputType {
        EVENT = 'EVENT',
        ENROLLMENT = 'ENROLLMENT',
        TRACKED_ENTITY_INSTANCE = 'TRACKED_ENTITY_INSTANCE',
    }

    export enum programStatus {
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED',
    }

    export enum regressionType {
        NONE = 'NONE',
        LINEAR = 'LINEAR',
        POLYNOMIAL = 'POLYNOMIAL',
        LOESS = 'LOESS',
    }

    export enum type {
        COLUMN = 'COLUMN',
        STACKED_COLUMN = 'STACKED_COLUMN',
        BAR = 'BAR',
        STACKED_BAR = 'STACKED_BAR',
        LINE = 'LINE',
        LINE_LIST = 'LINE_LIST',
        AREA = 'AREA',
        STACKED_AREA = 'STACKED_AREA',
        PIE = 'PIE',
        RADAR = 'RADAR',
        GAUGE = 'GAUGE',
        YEAR_OVER_YEAR_LINE = 'YEAR_OVER_YEAR_LINE',
        YEAR_OVER_YEAR_COLUMN = 'YEAR_OVER_YEAR_COLUMN',
        SINGLE_VALUE = 'SINGLE_VALUE',
        PIVOT_TABLE = 'PIVOT_TABLE',
        SCATTER = 'SCATTER',
        BUBBLE = 'BUBBLE',
    }

    export enum userOrgUnitType {
        DATA_CAPTURE = 'DATA_CAPTURE',
        DATA_OUTPUT = 'DATA_OUTPUT',
        TEI_SEARCH = 'TEI_SEARCH',
    }
}
