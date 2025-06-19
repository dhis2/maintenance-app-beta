import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
    SECTIONS_MAP,
} from '../../../lib'
import {
    DataSet,
    PickWithFieldFilters,
    ProgramIndicator,
} from '../../../types/generated'
export const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'style[color,icon]',
    'description',
    'program[id,programType, programTrackedEntityAttributes]',
    'decimals',
    'aggregationType',
    'analyticsType',
    'orgUnitField',
    'displayInForm',
    'legendSets[id, displayName]',
    'aggregateExportCategoryOptionCombo',
    'aggregateExportAttributeOptionCombo',
    'aggregateExportDataElement',
    'expression',
    'filter',
    'analyticsPeriodBoundaries[id,boundaryTarget,analyticsPeriodBoundaryType,offsetPeriods,offsetPeriodType,]',
] as const

export type ProgramIndicatorValues = PickWithFieldFilters<
    ProgramIndicator,
    typeof fieldFilters
>
