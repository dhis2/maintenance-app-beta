import i18n from '@dhis2/d2-i18n'
import { ProgramRuleAction } from '../../../../types/generated'
import type { ProgramRuleActionFormValues } from './fieldTypes'

/**
 * Per-action-type validation (e.g. HIDEFIELD requires dataElement or trackedEntityAttribute)
 */
export function validateProgramRuleAction(
    values: ProgramRuleActionFormValues
): Record<string, string> | undefined {
    const errors: Record<string, string> = {}
    const actionType = values.programRuleActionType
    const hasDataElement = !!values.dataElement?.id
    const hasTrackedEntityAttribute = !!values.trackedEntityAttribute?.id
    const hasContent = !!values.content?.trim()
    const hasData = !!values.data?.trim()
    const hasOption = !!values.option?.id
    const hasOptionGroup = !!values.optionGroup?.id

    if (actionType === ProgramRuleAction.programRuleActionType.HIDEFIELD) {
        if (!hasDataElement && !hasTrackedEntityAttribute) {
            errors.dataElement = i18n.t(
                'Select at least one: data element or tracked entity attribute'
            )
            errors.trackedEntityAttribute = i18n.t(
                'Select at least one: data element or tracked entity attribute'
            )
        }
    }
    if (
        actionType === ProgramRuleAction.programRuleActionType.SETMANDATORYFIELD
    ) {
        if (!hasDataElement && !hasTrackedEntityAttribute) {
            errors.dataElement = i18n.t(
                'Data element or tracked entity attribute must be selected'
            )
            errors.trackedEntityAttribute = i18n.t(
                'Data element or tracked entity attribute must be selected'
            )
        }
    }
    if (actionType === ProgramRuleAction.programRuleActionType.ASSIGN) {
        if (!hasDataElement && !hasTrackedEntityAttribute && !hasContent) {
            errors.dataElement = i18n.t(
                'Select one of: data element, tracked entity attribute, or program rule variable'
            )
            errors.trackedEntityAttribute = errors.dataElement
            errors.content = errors.dataElement
        }
        if (!hasData) {
            errors.data = i18n.t('Expression to assign is required')
        }
    }
    if (actionType === ProgramRuleAction.programRuleActionType.HIDEOPTION) {
        if (!hasDataElement && !hasTrackedEntityAttribute) {
            errors.dataElement = i18n.t(
                'Select a data element or tracked entity attribute with option set'
            )
            errors.trackedEntityAttribute = errors.dataElement
        }
        if ((hasDataElement || hasTrackedEntityAttribute) && !hasOption) {
            errors.option = i18n.t('Option to hide is required')
        }
    }
    if (
        actionType ===
            ProgramRuleAction.programRuleActionType.SHOWOPTIONGROUP ||
        actionType === ProgramRuleAction.programRuleActionType.HIDEOPTIONGROUP
    ) {
        if (!hasDataElement && !hasTrackedEntityAttribute) {
            errors.dataElement = i18n.t(
                'Select a data element or tracked entity attribute with option set'
            )
            errors.trackedEntityAttribute = errors.dataElement
        }
        if ((hasDataElement || hasTrackedEntityAttribute) && !hasOptionGroup) {
            errors.optionGroup = i18n.t(
                actionType ===
                    ProgramRuleAction.programRuleActionType.SHOWOPTIONGROUP
                    ? 'Option group to show is required'
                    : 'Option group to hide is required'
            )
        }
    }
    return Object.keys(errors).length ? errors : undefined
}
