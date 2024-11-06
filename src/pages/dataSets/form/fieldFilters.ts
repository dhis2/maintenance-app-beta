import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
} from '../../../lib'
import { DataSet, PickWithFieldFilters } from '../../../types/generated'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'categoryCombos[id,displayName]',
    'dataElementDecoration',
    'dataEntryForm[id]',
    'dataInputPeriods',
    'dataSetElements[id,dataElement[id,displayName]]',
    'dimensionItem',
    'displayOptions',
    'fieldCombinationRequired',
    'indicators[id,displayName]',
    'name',
    'organisationUnits[id,displayName]',
    'periodType',
    'renderAsTabs',
    'renderHorizontally',
    'sections',
    'skipOffline',
    'timelyDays',
    'validCommpleteOnly',
] as const

// DisplayOptions are handld by client only
// TODO: this should have a zod-schema and validation
type DisplayOptions = Record<string, unknown>

export type DataSetFormValues = PickWithFieldFilters<
    DataSet,
    typeof fieldFilters
> & { displayOptions: DisplayOptions }
