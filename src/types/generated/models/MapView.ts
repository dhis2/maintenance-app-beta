/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { CategoryDimension } from './CategoryDimension'
import type { CategoryOptionGroupSetDimension } from './CategoryOptionGroupSetDimension'
import type { DataDimensionItem } from './DataDimensionItem'
import type { DataElementGroupSetDimension } from './DataElementGroupSetDimension'
import type { OrganisationUnitGroupSetDimension } from './OrganisationUnitGroupSetDimension'
import type { DimensionalObject } from './DimensionalObject'
import type { Interpretation } from './Interpretation'
import type { LegendSet } from './LegendSet'
import type { OrganisationUnit } from './OrganisationUnit'
import type { OrganisationUnitGroup } from './OrganisationUnitGroup'
import type { OrganisationUnitGroupSet } from './OrganisationUnitGroupSet'
import type { Program } from './Program'
import type { ProgramStage } from './ProgramStage'
import type { TrackedEntityType } from './TrackedEntityType'
import type { User } from './User'
import type { RelativePeriods } from './RelativePeriods'
import type { Sharing } from './Sharing'
import type { TrackedEntityAttributeDimension } from './TrackedEntityAttributeDimension'
import type { TrackedEntityDataElementDimension } from './TrackedEntityDataElementDimension'
import type { TrackedEntityProgramIndicatorDimension } from './TrackedEntityProgramIndicatorDimension'
import type { Translation } from './Translation'

export type MapView = {
    access: Access
    aggregationType: MapView.aggregationType
    areaRadius: number
    attributeDimensions: Array<TrackedEntityAttributeDimension>
    attributeValues: Array<AttributeValue>
    categoryDimensions: Array<CategoryDimension>
    categoryOptionGroupSetDimensions: Array<CategoryOptionGroupSetDimension>
    classes: number
    code: string
    colorHigh: string
    colorLow: string
    colorScale: string
    columnDimensions: Array<string>
    columns: Array<DimensionalObject>
    completedOnly: boolean
    config: string
    created: string
    createdBy: User
    dataDimensionItems: Array<DataDimensionItem>
    dataElementDimensions: Array<TrackedEntityDataElementDimension>
    dataElementGroupSetDimensions: Array<DataElementGroupSetDimension>
    description: string
    digitGroupSeparator: MapView.digitGroupSeparator
    displayDescription: string
    displayFormName: string
    displayName: string
    displayShortName: string
    displaySubtitle: string
    displayTitle: string
    endDate: string
    eventClustering: boolean
    eventCoordinateField: string
    eventPointColor: string
    eventPointRadius: number
    eventStatus: MapView.eventStatus
    favorite: boolean
    favorites: Array<string>
    filterDimensions: Array<string>
    filters: Array<DimensionalObject>
    followUp: boolean
    formName: string
    hidden: boolean
    hideSubtitle: boolean
    hideTitle: boolean
    href: string
    id: string
    interpretations: Array<Interpretation>
    itemOrganisationUnitGroups: Array<OrganisationUnitGroup>
    labelFontColor: string
    labelFontSize: string
    labelFontStyle: string
    labelFontWeight: string
    labelTemplate: string
    labels: boolean
    lastUpdated: string
    lastUpdatedBy: User
    layer: string
    legendSet: LegendSet
    method: number
    noDataColor: string
    opacity: number
    orgUnitField: string
    orgUnitFieldDisplayName: string
    organisationUnitColor: string
    organisationUnitGroupSet: OrganisationUnitGroupSet
    organisationUnitGroupSetDimensions: Array<OrganisationUnitGroupSetDimension>
    organisationUnitLevels: Array<number>
    organisationUnitSelectionMode: MapView.organisationUnitSelectionMode
    organisationUnits: Array<OrganisationUnit>
    parentGraph: string
    parentGraphMap: Record<string, string>
    parentLevel: number
    periods: Array<string>
    program: Program
    programIndicatorDimensions: Array<TrackedEntityProgramIndicatorDimension>
    programStage: ProgramStage
    programStatus: MapView.programStatus
    radiusHigh: number
    radiusLow: number
    relativePeriods: RelativePeriods
    renderingStrategy: MapView.renderingStrategy
    rows: Array<DimensionalObject>
    sharing: Sharing
    shortName: string
    sortOrder: number
    startDate: string
    /**
     * The actual type is unknown.
     * (Java type was: `class java.lang.Object`)
     */
    styleDataItem: Record<string, any>
    subscribed: boolean
    subscribers: Array<string>
    subtitle: string
    thematicMapType: MapView.thematicMapType
    timeField: string
    title: string
    topLimit: number
    trackedEntityType: TrackedEntityType
    translations: Array<Translation>
    user: User
    userOrgUnitType: MapView.userOrgUnitType
    userOrganisationUnit: boolean
    userOrganisationUnitChildren: boolean
    userOrganisationUnitGrandChildren: boolean
}

export namespace MapView {
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

    export enum eventStatus {
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
        SCHEDULE = 'SCHEDULE',
        OVERDUE = 'OVERDUE',
        SKIPPED = 'SKIPPED',
    }

    export enum organisationUnitSelectionMode {
        SELECTED = 'SELECTED',
        CHILDREN = 'CHILDREN',
        DESCENDANTS = 'DESCENDANTS',
        ACCESSIBLE = 'ACCESSIBLE',
        CAPTURE = 'CAPTURE',
        ALL = 'ALL',
    }

    export enum programStatus {
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED',
    }

    export enum renderingStrategy {
        SINGLE = 'SINGLE',
        SPLIT_BY_PERIOD = 'SPLIT_BY_PERIOD',
        TIMELINE = 'TIMELINE',
    }

    export enum thematicMapType {
        CHOROPLETH = 'CHOROPLETH',
        BUBBLE = 'BUBBLE',
    }

    export enum userOrgUnitType {
        DATA_CAPTURE = 'DATA_CAPTURE',
        DATA_OUTPUT = 'DATA_OUTPUT',
        TEI_SEARCH = 'TEI_SEARCH',
    }
}
