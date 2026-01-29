import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
} from '../../../lib'
import { PickWithFieldFilters, ProgramRule } from '../../../types/generated'

export const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'code',
    'description',
    'priority',
    'condition',
    'program[id,displayName]',
    'programStage[id,displayName]',
] as const

export type ProgramRuleFormValues = PickWithFieldFilters<
    ProgramRule,
    typeof fieldFilters
> & { id: string }
