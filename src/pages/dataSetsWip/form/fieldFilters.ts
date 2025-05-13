// import { DataSetFormValues } from './dataSetFormSchema';
import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
} from '../../../lib'
import { DataSet, PickWithFieldFilters } from '../../../types/generated'

export const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'categoryCombo[id,displayName]',
    'dataElementDecoration',
    'dataEntryForm[id]',
    'dataInputPeriods',
    'dataSetElements[dataElement[id,displayName,categoryCombo[id,displayName]],categoryCombo[id,displayName]]',
    //'dataSetElements[id,dataElement[id,displayName]]',
    'dimensionItem',
    'displayOptions',
    'fieldCombinationRequired',
    'formType',
    'indicators[id,displayName]',
    'name',
    'organisationUnits[id,displayName]',
    'periodType',
    'renderAsTabs',
    'renderHorizontally',
    'sections',
    'style[color,icon',
    'skipOffline',
    'timelyDays',
    'validCommpleteOnly',
    'organisationUnits[id,displayName,path]',
    'compulsoryDataElementOperands[dataElement[id,displayName],id]',
    'openFuturePeriods',
    'expiryDays',
    'openPeriodsAfterCoEndDate',
    'formType',
    'displayOptions',
    'legendSets[id,displayName]',
] as const

// DisplayOptions are handled by client only, and thus dont have a generated type
// TODO: this should have a zod-schema and validation
type DisplayOptions = Record<string, unknown>

export type DataSetFormValues = PickWithFieldFilters<
    DataSet,
    typeof fieldFilters
> & { displayOptions: DisplayOptions }
const asf = {} as  DataSetFormValues
asf.dataSetElements.map(m => m.)
asf.compulsoryDataElementOperands?.map(m => m.)