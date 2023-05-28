/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { Axis } from './Axis'
import type { AxisV2 } from './AxisV2'
import type { CategoryDimension } from './CategoryDimension'
import type { CategoryOptionGroupSetDimension } from './CategoryOptionGroupSetDimension'
import type { DataDimensionItem } from './DataDimensionItem'
import type { DataElementGroupSetDimension } from './DataElementGroupSetDimension'
import type { Icon } from './Icon'
import type { LegendDefinitions } from './LegendDefinitions'
import type { OrganisationUnitGroupSetDimension } from './OrganisationUnitGroupSetDimension'
import type { OutlierAnalysis } from './OutlierAnalysis'
import type { DimensionalObject } from './DimensionalObject'
import type { Interpretation } from './Interpretation'
import type { OrganisationUnit } from './OrganisationUnit'
import type { OrganisationUnitGroup } from './OrganisationUnitGroup'
import type { User } from './User'
import type { RelativePeriods } from './RelativePeriods'
import type { ReportingParams } from './ReportingParams'
import type { Series } from './Series'
import type { SeriesKey } from './SeriesKey'
import type { Sharing } from './Sharing'
import type { TrackedEntityAttributeDimension } from './TrackedEntityAttributeDimension'
import type { TrackedEntityDataElementDimension } from './TrackedEntityDataElementDimension'
import type { TrackedEntityProgramIndicatorDimension } from './TrackedEntityProgramIndicatorDimension'
import type { Translation } from './Translation'
import type { VisualizationFontStyle } from './VisualizationFontStyle'

export type Visualization = {
    access: Access
    aggregationType: Visualization.aggregationType
    attributeDimensions: Array<TrackedEntityAttributeDimension>
    attributeValues: Array<AttributeValue>
    axes: Array<AxisV2>
    baseLineLabel: string
    baseLineValue: number
    categoryDimensions: Array<CategoryDimension>
    categoryOptionGroupSetDimensions: Array<CategoryOptionGroupSetDimension>
    code: string
    colSubTotals: boolean
    colTotals: boolean
    colorSet: string
    columnDimensions: Array<string>
    columns: Array<DimensionalObject>
    completedOnly: boolean
    created: string
    createdBy: User
    cumulativeValues: boolean
    dataDimensionItems: Array<DataDimensionItem>
    dataElementDimensions: Array<TrackedEntityDataElementDimension>
    dataElementGroupSetDimensions: Array<DataElementGroupSetDimension>
    description: string
    digitGroupSeparator: Visualization.digitGroupSeparator
    displayBaseLineLabel: string
    displayDensity: Visualization.displayDensity
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
    favorite: boolean
    favorites: Array<string>
    filterDimensions: Array<string>
    filters: Array<DimensionalObject>
    fixColumnHeaders: boolean
    fixRowHeaders: boolean
    fontSize: Visualization.fontSize
    fontStyle: VisualizationFontStyle
    formName: string
    hideEmptyColumns: boolean
    hideEmptyRowItems: Visualization.hideEmptyRowItems
    hideEmptyRows: boolean
    hideLegend: boolean
    hideSubtitle: boolean
    hideTitle: boolean
    href: string
    icons: Array<Icon>
    id: string
    interpretations: Array<Interpretation>
    itemOrganisationUnitGroups: Array<OrganisationUnitGroup>
    lastUpdated: string
    lastUpdatedBy: User
    legend: LegendDefinitions
    measureCriteria: string
    name: string
    noSpaceBetweenColumns: boolean
    numberType: Visualization.numberType
    optionalAxes: Array<Axis>
    orgUnitField: string
    organisationUnitGroupSetDimensions: Array<OrganisationUnitGroupSetDimension>
    organisationUnitLevels: Array<number>
    organisationUnits: Array<OrganisationUnit>
    outlierAnalysis: OutlierAnalysis
    parentGraphMap: Record<string, string>
    percentStackedValues: boolean
    periods: Array<string>
    programIndicatorDimensions: Array<TrackedEntityProgramIndicatorDimension>
    rangeAxisDecimals: number
    rangeAxisLabel: string
    rangeAxisMaxValue: number
    rangeAxisMinValue: number
    rangeAxisSteps: number
    regression: boolean
    regressionType: Visualization.regressionType
    relativePeriods: RelativePeriods
    reportingParams: ReportingParams
    rowDimensions: Array<string>
    rowSubTotals: boolean
    rowTotals: boolean
    rows: Array<DimensionalObject>
    series: Array<Series>
    seriesKey: SeriesKey
    sharing: Sharing
    shortName: string
    showData: boolean
    showDimensionLabels: boolean
    showHierarchy: boolean
    skipRounding: boolean
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
    type: Visualization.type
    user: User
    userOrgUnitType: Visualization.userOrgUnitType
    userOrganisationUnit: boolean
    userOrganisationUnitChildren: boolean
    userOrganisationUnitGrandChildren: boolean
    visualizationPeriodName: string
    yearlySeries: Array<string>
}

export namespace Visualization {
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

    export enum numberType {
        VALUE = 'VALUE',
        ROW_PERCENTAGE = 'ROW_PERCENTAGE',
        COLUMN_PERCENTAGE = 'COLUMN_PERCENTAGE',
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
        AREA = 'AREA',
        STACKED_AREA = 'STACKED_AREA',
        PIE = 'PIE',
        RADAR = 'RADAR',
        GAUGE = 'GAUGE',
        YEAR_OVER_YEAR_LINE = 'YEAR_OVER_YEAR_LINE',
        YEAR_OVER_YEAR_COLUMN = 'YEAR_OVER_YEAR_COLUMN',
        SCATTER = 'SCATTER',
        BUBBLE = 'BUBBLE',
        SINGLE_VALUE = 'SINGLE_VALUE',
        PIVOT_TABLE = 'PIVOT_TABLE',
    }

    export enum userOrgUnitType {
        DATA_CAPTURE = 'DATA_CAPTURE',
        DATA_OUTPUT = 'DATA_OUTPUT',
        TEI_SEARCH = 'TEI_SEARCH',
    }
}
