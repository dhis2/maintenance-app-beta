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
    'program[id,displayName,programType]',
    'programStage[id,displayName]',
    'programRuleActions[id,programRuleActionType,priority,content,data,location,templateUid,notificationTemplate[id,displayName],dataElement[id,displayName],trackedEntityAttribute[id,displayName],programStage[id,displayName],programStageSection[id,displayName],option[id,displayName],optionGroup[id,displayName],access]',
] as const

export type ProgramRuleFormValues = PickWithFieldFilters<
    ProgramRule,
    typeof fieldFilters
>
