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
    const hasOptionGroup = !!values.optionGroup?.id
    const hasContent = !!(values.content && String(values.content).trim())
    const hasData = !!(values.data && String(values.data).trim())
    const hasLocation = !!(values.location && String(values.location).trim())

    if (
        actionType === programRuleActionType.DISPLAYTEXT ||
        actionType === programRuleActionType.DISPLAYKEYVALUEPAIR
    ) {
        if (!hasLocation) {
            errors.location = VALIDATION_MESSAGES.DISPLAY_WIDGET
        }
    }

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

    if (actionType === programRuleActionType.SETMANDATORYFIELD) {
        if (!hasDataElement && !hasTrackedEntityAttribute) {
            errors.dataElement = VALIDATION_MESSAGES.SETMANDATORYFIELD
            errors.trackedEntityAttribute =
                VALIDATION_MESSAGES.SETMANDATORYFIELD
        }
    }

    if (actionType === programRuleActionType.ASSIGN) {
        const hasAssignTarget =
            hasDataElement || hasTrackedEntityAttribute || hasContent
        if (!hasAssignTarget) {
            errors.dataElement = VALIDATION_MESSAGES.ASSIGN_TARGET
            errors.trackedEntityAttribute = VALIDATION_MESSAGES.ASSIGN_TARGET
            errors.content = VALIDATION_MESSAGES.ASSIGN_TARGET
        }
        if (!hasData) {
            errors.data = VALIDATION_MESSAGES.ASSIGN_EXPRESSION
        }
    }

    if (
        actionType === programRuleActionType.HIDEOPTIONGROUP ||
        actionType === programRuleActionType.SHOWOPTIONGROUP
    ) {
        if (!hasDataElement && !hasTrackedEntityAttribute) {
            errors.dataElement = VALIDATION_MESSAGES.OPTIONGROUP_DE_TEA
            errors.trackedEntityAttribute =
                VALIDATION_MESSAGES.OPTIONGROUP_DE_TEA
        }
        if ((hasDataElement || hasTrackedEntityAttribute) && !hasOptionGroup) {
            errors.optionGroup = VALIDATION_MESSAGES.OPTIONGROUP_GROUP
        }
    }

    return errors
}
