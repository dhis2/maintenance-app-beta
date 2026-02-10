import { ProgramRuleAction } from '../../../../types/generated'
import { VALIDATION_MESSAGES } from './constants'
import type { ProgramRuleActionFormValues } from './types'

const { programRuleActionType } = ProgramRuleAction

type ValidationErrors = Partial<
    Record<keyof ProgramRuleActionFormValues, string>
>

type FieldFlags = ReturnType<typeof getFieldFlags>

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

function requireDisplayWidget(flags: FieldFlags): ValidationErrors {
    if (flags.hasLocation) {
        return {}
    }
    return { location: VALIDATION_MESSAGES.DISPLAY_WIDGET }
}

function requireStaticText(flags: FieldFlags): ValidationErrors {
    if (flags.hasContent) {
        return {}
    }
    return { content: VALIDATION_MESSAGES.STATIC_TEXT_REQUIRED }
}

function requireProgramStage(flags: FieldFlags): ValidationErrors {
    if (flags.hasProgramStage) {
        return {}
    }
    return { programStage: VALIDATION_MESSAGES.HIDEPROGRAMSTAGE_STAGE }
}

function requireMessageTemplate(flags: FieldFlags): ValidationErrors {
    if (flags.hasTemplateUid) {
        return {}
    }
    return { templateUid: VALIDATION_MESSAGES.MESSAGE_TEMPLATE }
}

function validateDisplayText(flags: FieldFlags): ValidationErrors {
    const errors = requireDisplayWidget(flags)
    if (!flags.hasContent) {
        errors.content = VALIDATION_MESSAGES.STATIC_TEXT_REQUIRED
    }
    return errors
}

function validateDisplayKeyValuePair(flags: FieldFlags): ValidationErrors {
    const errors = requireDisplayWidget(flags)
    if (!flags.hasContent) {
        errors.content = VALIDATION_MESSAGES.KEY_LABEL_REQUIRED
    }
    return errors
}

function validateHideField(flags: FieldFlags): ValidationErrors {
    const errors: ValidationErrors = {}
    const hasTarget = flags.hasDataElement || flags.hasTrackedEntityAttribute
    if (!hasTarget) {
        errors.dataElement = VALIDATION_MESSAGES.HIDEFIELD
        errors.trackedEntityAttribute = VALIDATION_MESSAGES.HIDEFIELD
    }
    return errors
}

function validateHideSection(flags: FieldFlags): ValidationErrors {
    if (flags.hasProgramStageSection) {
        return {}
    }
    return { programStageSection: VALIDATION_MESSAGES.HIDESECTION_SECTION }
}

function validateHideProgramStage(flags: FieldFlags): ValidationErrors {
    return requireProgramStage(flags)
}

function validateAssign(flags: FieldFlags): ValidationErrors {
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

function validateShowWarning(flags: FieldFlags): ValidationErrors {
    return requireStaticText(flags)
}

function validateWarningOnComplete(flags: FieldFlags): ValidationErrors {
    return requireStaticText(flags)
}

function validateShowError(flags: FieldFlags): ValidationErrors {
    return requireStaticText(flags)
}

function validateErrorOnComplete(flags: FieldFlags): ValidationErrors {
    return requireStaticText(flags)
}

function validateCreateEvent(flags: FieldFlags): ValidationErrors {
    return requireProgramStage(flags)
}

function validateSetMandatoryField(flags: FieldFlags): ValidationErrors {
    if (flags.hasDataElement || flags.hasTrackedEntityAttribute) {
        return {}
    }
    return {
        dataElement: VALIDATION_MESSAGES.SETMANDATORYFIELD,
        trackedEntityAttribute: VALIDATION_MESSAGES.SETMANDATORYFIELD,
    }
}

function validateSendMessage(flags: FieldFlags): ValidationErrors {
    return requireMessageTemplate(flags)
}

function validateScheduleMessage(flags: FieldFlags): ValidationErrors {
    return requireMessageTemplate(flags)
}

function validateHideOption(flags: FieldFlags): ValidationErrors {
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

function requireOptionGroupFields(flags: FieldFlags): ValidationErrors {
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

function validateShowOptionGroup(flags: FieldFlags): ValidationErrors {
    return requireOptionGroupFields(flags)
}

function validateHideOptionGroup(flags: FieldFlags): ValidationErrors {
    return requireOptionGroupFields(flags)
}

export function validateProgramRuleAction(
    values: ProgramRuleActionFormValues
): ValidationErrors {
    const actionType = values.programRuleActionType
    const flags = getFieldFlags(values)
    const errors: ValidationErrors = {}

    const validators: Partial<
        Record<string, (f: FieldFlags) => ValidationErrors>
    > = {
        [programRuleActionType.DISPLAYTEXT]: validateDisplayText,
        [programRuleActionType.DISPLAYKEYVALUEPAIR]:
            validateDisplayKeyValuePair,
        [programRuleActionType.HIDEFIELD]: validateHideField,
        [programRuleActionType.HIDESECTION]: validateHideSection,
        [programRuleActionType.HIDEPROGRAMSTAGE]: validateHideProgramStage,
        [programRuleActionType.ASSIGN]: validateAssign,
        [programRuleActionType.SHOWWARNING]: validateShowWarning,
        [programRuleActionType.WARNINGONCOMPLETE]: validateWarningOnComplete,
        [programRuleActionType.SHOWERROR]: validateShowError,
        [programRuleActionType.ERRORONCOMPLETE]: validateErrorOnComplete,
        [programRuleActionType.CREATEEVENT]: validateCreateEvent,
        [programRuleActionType.SETMANDATORYFIELD]: validateSetMandatoryField,
        [programRuleActionType.SENDMESSAGE]: validateSendMessage,
        [programRuleActionType.SCHEDULEMESSAGE]: validateScheduleMessage,
        [programRuleActionType.HIDEOPTION]: validateHideOption,
        [programRuleActionType.SHOWOPTIONGROUP]: validateShowOptionGroup,
        [programRuleActionType.HIDEOPTIONGROUP]: validateHideOptionGroup,
    }

    const validate = actionType ? validators[actionType] : undefined
    if (validate) {
        Object.assign(errors, validate(flags))
    }

    return errors
}
