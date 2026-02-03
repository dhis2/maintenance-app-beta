import i18n from '@dhis2/d2-i18n'
import { ProgramRuleAction } from '../../../../types/generated'
import type { ProgramRuleActionFormValues } from './fieldTypes'

/**
 * Per-action-type validation. Blocks submit when required fields are missing
 * so actions cannot be added/saved without required data.
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
    const hasLocation = !!values.location?.trim()
    const hasProgramStage = !!values.programStage?.id
    const hasProgramStageSection = !!values.programStageSection?.id
    const hasTemplateUid = !!values.templateUid?.trim()

    if (!actionType?.trim()) {
        errors.programRuleActionType = i18n.t('Action is required')
    }

    if (actionType === ProgramRuleAction.programRuleActionType.DISPLAYTEXT) {
        if (!hasLocation) {
            errors.location = i18n.t('Display widget is required')
        }
        if (!hasContent) {
            errors.content = i18n.t('Static text is required')
        }
    }
    if (
        actionType ===
        ProgramRuleAction.programRuleActionType.DISPLAYKEYVALUEPAIR
    ) {
        if (!hasLocation) {
            errors.location = i18n.t('Display widget is required')
        }
        if (!hasContent) {
            errors.content = i18n.t('Key label is required')
        }
    }
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
    if (actionType === ProgramRuleAction.programRuleActionType.HIDESECTION) {
        if (!hasProgramStageSection) {
            errors.programStageSection = i18n.t(
                'Program stage section to hide is required'
            )
        }
    }
    if (
        actionType === ProgramRuleAction.programRuleActionType.HIDEPROGRAMSTAGE
    ) {
        if (!hasProgramStage) {
            errors.programStage = i18n.t('Program stage is required')
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
    if (
        actionType === ProgramRuleAction.programRuleActionType.SHOWWARNING ||
        actionType === ProgramRuleAction.programRuleActionType.SHOWERROR ||
        actionType ===
            ProgramRuleAction.programRuleActionType.WARNINGONCOMPLETE ||
        actionType === ProgramRuleAction.programRuleActionType.ERRORONCOMPLETE
    ) {
        if (!hasContent) {
            errors.content = i18n.t('Static text is required')
        }
    }
    if (actionType === ProgramRuleAction.programRuleActionType.CREATEEVENT) {
        if (!hasProgramStage) {
            errors.programStage = i18n.t('Program stage is required')
        }
    }
    if (actionType === ProgramRuleAction.programRuleActionType.SENDMESSAGE) {
        if (!hasTemplateUid) {
            errors.templateUid = i18n.t('Message template is required')
        }
    }
    if (
        actionType === ProgramRuleAction.programRuleActionType.SCHEDULEMESSAGE
    ) {
        if (!hasTemplateUid) {
            errors.templateUid = i18n.t('Message template is required')
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
