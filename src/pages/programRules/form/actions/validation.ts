import i18n from '@dhis2/d2-i18n'
import { ProgramRuleAction } from '../../../../types/generated'
import type { ProgramRuleActionFormValues } from './fieldTypes'

type ValidationContext = {
    actionType: string | undefined
    hasDataElement: boolean
    hasTrackedEntityAttribute: boolean
    hasContent: boolean
    hasData: boolean
    hasOption: boolean
    hasOptionGroup: boolean
    hasLocation: boolean
    hasProgramStage: boolean
    hasProgramStageSection: boolean
    hasTemplateUid: boolean
}

function buildContext(values: ProgramRuleActionFormValues): ValidationContext {
    return {
        actionType: values.programRuleActionType,
        hasDataElement: !!values.dataElement?.id,
        hasTrackedEntityAttribute: !!values.trackedEntityAttribute?.id,
        hasContent: !!values.content?.trim(),
        hasData: !!values.data?.trim(),
        hasOption: !!values.option?.id,
        hasOptionGroup: !!values.optionGroup?.id,
        hasLocation: !!values.location?.trim(),
        hasProgramStage: !!values.programStage?.id,
        hasProgramStageSection: !!values.programStageSection?.id,
        hasTemplateUid: !!values.templateUid?.trim(),
    }
}

function validateDisplayText(
    errors: Record<string, string>,
    ctx: ValidationContext
): void {
    if (!ctx.hasLocation) {
        errors.location = i18n.t('Display widget is required')
    }
    if (!ctx.hasContent) {
        errors.content = i18n.t('Static text is required')
    }
}

function validateDisplayKeyValuePair(
    errors: Record<string, string>,
    ctx: ValidationContext
): void {
    if (!ctx.hasLocation) {
        errors.location = i18n.t('Display widget is required')
    }
    if (!ctx.hasContent) {
        errors.content = i18n.t('Key label is required')
    }
}

function validateHideField(
    errors: Record<string, string>,
    ctx: ValidationContext
): void {
    if (!ctx.hasDataElement && !ctx.hasTrackedEntityAttribute) {
        const msg = i18n.t(
            'Select at least one: data element or tracked entity attribute'
        )
        errors.dataElement = msg
        errors.trackedEntityAttribute = msg
    }
}

function validateHideSection(
    errors: Record<string, string>,
    ctx: ValidationContext
): void {
    if (!ctx.hasProgramStageSection) {
        errors.programStageSection = i18n.t(
            'Program stage section to hide is required'
        )
    }
}

function validateHideProgramStage(
    errors: Record<string, string>,
    ctx: ValidationContext
): void {
    if (!ctx.hasProgramStage) {
        errors.programStage = i18n.t('Program stage is required')
    }
}

function validateSetMandatoryField(
    errors: Record<string, string>,
    ctx: ValidationContext
): void {
    if (!ctx.hasDataElement && !ctx.hasTrackedEntityAttribute) {
        const msg = i18n.t(
            'Data element or tracked entity attribute must be selected'
        )
        errors.dataElement = msg
        errors.trackedEntityAttribute = msg
    }
}

function validateAssign(
    errors: Record<string, string>,
    ctx: ValidationContext
): void {
    if (
        !ctx.hasDataElement &&
        !ctx.hasTrackedEntityAttribute &&
        !ctx.hasContent
    ) {
        const msg = i18n.t(
            'Select one of: data element, tracked entity attribute, or program rule variable'
        )
        errors.dataElement = msg
        errors.trackedEntityAttribute = msg
        errors.content = msg
    }
    if (!ctx.hasData) {
        errors.data = i18n.t('Expression to assign is required')
    }
}

const MESSAGE_ACTION_TYPES = [
    ProgramRuleAction.programRuleActionType.SHOWWARNING,
    ProgramRuleAction.programRuleActionType.SHOWERROR,
    ProgramRuleAction.programRuleActionType.WARNINGONCOMPLETE,
    ProgramRuleAction.programRuleActionType.ERRORONCOMPLETE,
]

function validateMessageActions(
    errors: Record<string, string>,
    ctx: ValidationContext
): void {
    const messageTypes = MESSAGE_ACTION_TYPES as readonly string[]
    if (messageTypes.includes(ctx.actionType ?? '') && !ctx.hasContent) {
        errors.content = i18n.t('Static text is required')
    }
}

function validateCreateEvent(
    errors: Record<string, string>,
    ctx: ValidationContext
): void {
    validateHideProgramStage(errors, ctx)
}

function validateTemplateRequired(
    errors: Record<string, string>,
    ctx: ValidationContext
): void {
    if (!ctx.hasTemplateUid) {
        errors.templateUid = i18n.t('Message template is required')
    }
}

function validateHideOption(
    errors: Record<string, string>,
    ctx: ValidationContext
): void {
    if (!ctx.hasDataElement && !ctx.hasTrackedEntityAttribute) {
        const msg = i18n.t(
            'Select a data element or tracked entity attribute with option set'
        )
        errors.dataElement = msg
        errors.trackedEntityAttribute = msg
    }
    if (
        (ctx.hasDataElement || ctx.hasTrackedEntityAttribute) &&
        !ctx.hasOption
    ) {
        errors.option = i18n.t('Option to hide is required')
    }
}

function validateOptionGroup(
    errors: Record<string, string>,
    ctx: ValidationContext
): void {
    if (!ctx.hasDataElement && !ctx.hasTrackedEntityAttribute) {
        const msg = i18n.t(
            'Select a data element or tracked entity attribute with option set'
        )
        errors.dataElement = msg
        errors.trackedEntityAttribute = msg
    }
    if (
        (ctx.hasDataElement || ctx.hasTrackedEntityAttribute) &&
        !ctx.hasOptionGroup
    ) {
        errors.optionGroup = i18n.t(
            ctx.actionType ===
                ProgramRuleAction.programRuleActionType.SHOWOPTIONGROUP
                ? 'Option group to show is required'
                : 'Option group to hide is required'
        )
    }
}

type ValidatorEntry = [
    string,
    (errors: Record<string, string>, ctx: ValidationContext) => void
]

const ACTION_VALIDATORS: ValidatorEntry[] = [
    [ProgramRuleAction.programRuleActionType.DISPLAYTEXT, validateDisplayText],
    [
        ProgramRuleAction.programRuleActionType.DISPLAYKEYVALUEPAIR,
        validateDisplayKeyValuePair,
    ],
    [ProgramRuleAction.programRuleActionType.HIDEFIELD, validateHideField],
    [ProgramRuleAction.programRuleActionType.HIDESECTION, validateHideSection],
    [
        ProgramRuleAction.programRuleActionType.HIDEPROGRAMSTAGE,
        validateHideProgramStage,
    ],
    [
        ProgramRuleAction.programRuleActionType.SETMANDATORYFIELD,
        validateSetMandatoryField,
    ],
    [ProgramRuleAction.programRuleActionType.ASSIGN, validateAssign],
    [ProgramRuleAction.programRuleActionType.CREATEEVENT, validateCreateEvent],
    [
        ProgramRuleAction.programRuleActionType.SENDMESSAGE,
        validateTemplateRequired,
    ],
    [
        ProgramRuleAction.programRuleActionType.SCHEDULEMESSAGE,
        validateTemplateRequired,
    ],
    [ProgramRuleAction.programRuleActionType.HIDEOPTION, validateHideOption],
    [
        ProgramRuleAction.programRuleActionType.SHOWOPTIONGROUP,
        validateOptionGroup,
    ],
    [
        ProgramRuleAction.programRuleActionType.HIDEOPTIONGROUP,
        validateOptionGroup,
    ],
]

/**
 * Per-action-type validation. Blocks submit when required fields are missing
 * so actions cannot be added/saved without required data.
 */
export function validateProgramRuleAction(
    values: ProgramRuleActionFormValues
): Record<string, string> | undefined {
    const errors: Record<string, string> = {}
    const ctx = buildContext(values)

    if (!ctx.actionType?.trim()) {
        errors.programRuleActionType = i18n.t('Action is required')
    }

    validateMessageActions(errors, ctx)

    for (const [actionType, validator] of ACTION_VALIDATORS) {
        if (ctx.actionType === actionType) {
            validator(errors, ctx)
            break
        }
    }

    return Object.keys(errors).length > 0 ? errors : undefined
}
