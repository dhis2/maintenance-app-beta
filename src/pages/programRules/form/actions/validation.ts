import { ProgramRuleAction } from '../../../../types/generated'
import { VALIDATION_MESSAGES } from './constants'
import type { ProgramRuleActionFormValues } from './types'

const { programRuleActionType } = ProgramRuleAction

export function validateProgramRuleAction(
    values: ProgramRuleActionFormValues
): Partial<Record<keyof ProgramRuleActionFormValues, string>> {
    const errors: Partial<Record<keyof ProgramRuleActionFormValues, string>> =
        {}
    const actionType = values.programRuleActionType
    const hasDataElement = !!values.dataElement?.id
    const hasTrackedEntityAttribute = !!values.trackedEntityAttribute?.id
    const hasOption = !!values.option?.id

    if (actionType === programRuleActionType.HIDEFIELD) {
        if (!hasDataElement && !hasTrackedEntityAttribute) {
            errors.dataElement = VALIDATION_MESSAGES.HIDEFIELD
            errors.trackedEntityAttribute = VALIDATION_MESSAGES.HIDEFIELD
        }
    }

    if (actionType === programRuleActionType.HIDEOPTION) {
        if (!hasDataElement && !hasTrackedEntityAttribute) {
            errors.dataElement = VALIDATION_MESSAGES.HIDEOPTION_DE_TEA
            errors.trackedEntityAttribute =
                VALIDATION_MESSAGES.HIDEOPTION_DE_TEA
        }
        if ((hasDataElement || hasTrackedEntityAttribute) && !hasOption) {
            errors.option = VALIDATION_MESSAGES.HIDEOPTION_OPTION
        }
    }

    return errors
}
