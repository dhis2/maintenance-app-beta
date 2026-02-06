/**
 * API field selection for program rule (edit) and programRuleActions nested fields.
 * programType on program so we can show "Program stages to trigger rule" only for tracker programs.
 */
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
    `programRuleActions['id,programRuleActionType,content,data,location,dataElement[id,displayName],trackedEntityAttribute[id,displayName],programStage[id,displayName],programStageSection[id,displayName],option[id,displayName],optionGroup[id,displayName],templateUid,access']`,
] as const

export type ProgramRuleFormValues = PickWithFieldFilters<
    ProgramRule,
    typeof fieldFilters
> & { id: string }
