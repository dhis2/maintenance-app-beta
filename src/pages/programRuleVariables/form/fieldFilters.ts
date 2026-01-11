import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
} from '../../../lib'
import {
    PickWithFieldFilters,
    ProgramRuleVariable,
} from '../../../types/generated'

export const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'code',
    'description',
    'programRuleVariableSourceType',
    'valueType',
    'program[id,displayName]',
    'programStage[id,displayName]',
    'dataElement[id,displayName]',
    'trackedEntityAttribute[id,displayName]',
    'useCodeForOptionSet',
] as const

export type ProgramRuleVariableFormValues = PickWithFieldFilters<
    ProgramRuleVariable,
    typeof fieldFilters
>
