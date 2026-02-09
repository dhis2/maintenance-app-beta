import { ProgramRuleAction } from '../../../../types/generated'
import { VALIDATION_MESSAGES } from './constants'
import type { ProgramRuleActionFormValues } from './types'

const { programRuleActionType } = ProgramRuleAction

type ValidationErrors = Partial<
    Record<keyof ProgramRuleActionFormValues, string>
>

function getFieldFlags(values: ProgramRuleActionFormValues) {
    return {
        hasDataElement: !!values.dataElement?.id,
        hasTrackedEntityAttribute: !!values.trackedEntityAttribute?.id,
        hasOption: !!values.option?.id,
        hasOptionGroup: !!values.optionGroup?.id,
        hasProgramStageSection: !!values.programStageSection?.id,
        hasProgramStage: !!values.programStage?.id,
        hasTemplateUid: !!(
            values.templateUid && String(values.templateUid).trim()
        ),
        hasContent: !!(values.content && String(values.content).trim()),
        hasData: !!(values.data && String(values.data).trim()),
        hasLocation: !!(values.location && String(values.location).trim()),
    }
}

function validateDisplayLocation(
    flags: ReturnType<typeof getFieldFlags>
): ValidationErrors {
    if (flags.hasLocation) {
        return {}
    }
    return { location: VALIDATION_MESSAGES.DISPLAY_WIDGET }
}

function validateDisplayText(
    flags: ReturnType<typeof getFieldFlags>
): ValidationErrors {
    const errors = validateDisplayLocation(flags)
    if (!flags.hasContent) {
        errors.content = VALIDATION_MESSAGES.STATIC_TEXT_REQUIRED
    }
    return errors
}

function validateDisplayKeyValuePair(
    flags: ReturnType<typeof getFieldFlags>
): ValidationErrors {
    const errors = validateDisplayLocation(flags)
    if (!flags.hasContent) {
        errors.content = VALIDATION_MESSAGES.KEY_LABEL_REQUIRED
    }
    return errors
}

function validateHideField(
    flags: ReturnType<typeof getFieldFlags>
): ValidationErrors {
    if (flags.hasDataElement || flags.hasTrackedEntityAttribute) {
        return {}
    }
    return {
        dataElement: VALIDATION_MESSAGES.HIDEFIELD,
        trackedEntityAttribute: VALIDATION_MESSAGES.HIDEFIELD,
    }
}

function validateHideSection(
    flags: ReturnType<typeof getFieldFlags>
): ValidationErrors {
    if (flags.hasProgramStageSection) {
        return {}
    }
    return { programStageSection: VALIDATION_MESSAGES.HIDESECTION_SECTION }
}

function validateHideOption(
    flags: ReturnType<typeof getFieldFlags>
): ValidationErrors {
    const errors: ValidationErrors = {}
    if (!flags.hasDataElement && !flags.hasTrackedEntityAttribute) {
        errors.dataElement = VALIDATION_MESSAGES.HIDEOPTION_DE_TEA
        errors.trackedEntityAttribute = VALIDATION_MESSAGES.HIDEOPTION_DE_TEA
    }
    if (
        (flags.hasDataElement || flags.hasTrackedEntityAttribute) &&
        !flags.hasOption
    ) {
        errors.option = VALIDATION_MESSAGES.HIDEOPTION_OPTION
    }
    return errors
}

function validateSetMandatoryField(
    flags: ReturnType<typeof getFieldFlags>
): ValidationErrors {
    if (flags.hasDataElement || flags.hasTrackedEntityAttribute) {
        return {}
    }
    return {
        dataElement: VALIDATION_MESSAGES.SETMANDATORYFIELD,
        trackedEntityAttribute: VALIDATION_MESSAGES.SETMANDATORYFIELD,
    }
}

function validateAssign(
    flags: ReturnType<typeof getFieldFlags>
): ValidationErrors {
    const errors: ValidationErrors = {}
    const hasTarget =
        flags.hasDataElement ||
        flags.hasTrackedEntityAttribute ||
        flags.hasContent
    if (!hasTarget) {
        errors.dataElement = VALIDATION_MESSAGES.ASSIGN_TARGET
        errors.trackedEntityAttribute = VALIDATION_MESSAGES.ASSIGN_TARGET
        errors.content = VALIDATION_MESSAGES.ASSIGN_TARGET
    }
    if (!flags.hasData) {
        errors.data = VALIDATION_MESSAGES.ASSIGN_EXPRESSION
    }
    return errors
}

function validateOptionGroup(
    flags: ReturnType<typeof getFieldFlags>
): ValidationErrors {
    const errors: ValidationErrors = {}
    if (!flags.hasDataElement && !flags.hasTrackedEntityAttribute) {
        errors.dataElement = VALIDATION_MESSAGES.OPTIONGROUP_DE_TEA
        errors.trackedEntityAttribute = VALIDATION_MESSAGES.OPTIONGROUP_DE_TEA
    }
    if (
        (flags.hasDataElement || flags.hasTrackedEntityAttribute) &&
        !flags.hasOptionGroup
    ) {
        errors.optionGroup = VALIDATION_MESSAGES.OPTIONGROUP_GROUP
    }
    return errors
}

function validateMessageTemplate(
    flags: ReturnType<typeof getFieldFlags>
): ValidationErrors {
    if (flags.hasTemplateUid) {
        return {}
    }
    return { templateUid: VALIDATION_MESSAGES.MESSAGE_TEMPLATE }
}

function validateHideProgramStage(
    flags: ReturnType<typeof getFieldFlags>
): ValidationErrors {
    if (flags.hasProgramStage) {
        return {}
    }
    return { programStage: VALIDATION_MESSAGES.HIDEPROGRAMSTAGE_STAGE }
}

function validateMessageAction(
    flags: ReturnType<typeof getFieldFlags>
): ValidationErrors {
    if (flags.hasContent) {
        return {}
    }
    return { content: VALIDATION_MESSAGES.STATIC_TEXT_REQUIRED }
}

export function validateProgramRuleAction(
    values: ProgramRuleActionFormValues
): ValidationErrors {
    const actionType = values.programRuleActionType
    const flags = getFieldFlags(values)
    const errors: ValidationErrors = {}

    const validators: Partial<
        Record<
            string,
            (f: ReturnType<typeof getFieldFlags>) => ValidationErrors
        >
    > = {
        [programRuleActionType.DISPLAYTEXT]: validateDisplayText,
        [programRuleActionType.DISPLAYKEYVALUEPAIR]:
            validateDisplayKeyValuePair,
        [programRuleActionType.HIDEFIELD]: validateHideField,
        [programRuleActionType.HIDESECTION]: validateHideSection,
        [programRuleActionType.HIDEOPTION]: validateHideOption,
        [programRuleActionType.SETMANDATORYFIELD]: validateSetMandatoryField,
        [programRuleActionType.ASSIGN]: validateAssign,
        [programRuleActionType.HIDEPROGRAMSTAGE]: validateHideProgramStage,
        [programRuleActionType.SENDMESSAGE]: validateMessageTemplate,
        [programRuleActionType.SCHEDULEMESSAGE]: validateMessageTemplate,
        [programRuleActionType.HIDEOPTIONGROUP]: validateOptionGroup,
        [programRuleActionType.SHOWOPTIONGROUP]: validateOptionGroup,
        [programRuleActionType.SHOWWARNING]: validateMessageAction,
        [programRuleActionType.SHOWERROR]: validateMessageAction,
        [programRuleActionType.WARNINGONCOMPLETE]: validateMessageAction,
        [programRuleActionType.ERRORONCOMPLETE]: validateMessageAction,
    }

    const validate = validators[actionType ?? '']
    if (validate) {
        Object.assign(errors, validate(flags))
    }

    return errors
}
