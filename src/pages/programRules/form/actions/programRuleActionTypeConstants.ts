import i18n from '@dhis2/d2-i18n'
import { ProgramRuleAction } from '../../../../types/generated'

export const programRuleActionTypeLabels: Record<string, string> = {
    [ProgramRuleAction.programRuleActionType.ASSIGN]: i18n.t('Assign'),
    [ProgramRuleAction.programRuleActionType.CREATEEVENT]:
        i18n.t('Create event'),
    [ProgramRuleAction.programRuleActionType.DISPLAYKEYVALUEPAIR]: i18n.t(
        'Display key-value pair'
    ),
    [ProgramRuleAction.programRuleActionType.DISPLAYTEXT]:
        i18n.t('Display text'),
    [ProgramRuleAction.programRuleActionType.ERRORONCOMPLETE]:
        i18n.t('Error on complete'),
    [ProgramRuleAction.programRuleActionType.HIDEFIELD]: i18n.t('Hide field'),
    [ProgramRuleAction.programRuleActionType.HIDEOPTION]: i18n.t('Hide option'),
    [ProgramRuleAction.programRuleActionType.HIDEOPTIONGROUP]:
        i18n.t('Hide option group'),
    [ProgramRuleAction.programRuleActionType.HIDEPROGRAMSTAGE]:
        i18n.t('Hide program stage'),
    [ProgramRuleAction.programRuleActionType.HIDESECTION]:
        i18n.t('Hide section'),
    [ProgramRuleAction.programRuleActionType.SCHEDULEMESSAGE]:
        i18n.t('Schedule message'),
    [ProgramRuleAction.programRuleActionType.SENDMESSAGE]:
        i18n.t('Send message'),
    [ProgramRuleAction.programRuleActionType.SETMANDATORYFIELD]: i18n.t(
        'Set mandatory field'
    ),
    [ProgramRuleAction.programRuleActionType.SHOWERROR]: i18n.t('Show error'),
    [ProgramRuleAction.programRuleActionType.SHOWOPTIONGROUP]:
        i18n.t('Show option group'),
    [ProgramRuleAction.programRuleActionType.SHOWWARNING]:
        i18n.t('Show warning'),
    [ProgramRuleAction.programRuleActionType.WARNINGONCOMPLETE]: i18n.t(
        'Warning on complete'
    ),
}

export const PROGRAM_RULE_ACTION_TYPE_VALUES = [
    ProgramRuleAction.programRuleActionType.ASSIGN,
    ProgramRuleAction.programRuleActionType.CREATEEVENT,
    ProgramRuleAction.programRuleActionType.DISPLAYKEYVALUEPAIR,
    ProgramRuleAction.programRuleActionType.DISPLAYTEXT,
    ProgramRuleAction.programRuleActionType.ERRORONCOMPLETE,
    ProgramRuleAction.programRuleActionType.HIDEFIELD,
    ProgramRuleAction.programRuleActionType.HIDEOPTION,
    ProgramRuleAction.programRuleActionType.HIDEOPTIONGROUP,
    ProgramRuleAction.programRuleActionType.HIDEPROGRAMSTAGE,
    ProgramRuleAction.programRuleActionType.HIDESECTION,
    ProgramRuleAction.programRuleActionType.SCHEDULEMESSAGE,
    ProgramRuleAction.programRuleActionType.SENDMESSAGE,
    ProgramRuleAction.programRuleActionType.SETMANDATORYFIELD,
    ProgramRuleAction.programRuleActionType.SHOWERROR,
    ProgramRuleAction.programRuleActionType.SHOWOPTIONGROUP,
    ProgramRuleAction.programRuleActionType.SHOWWARNING,
    ProgramRuleAction.programRuleActionType.WARNINGONCOMPLETE,
] as const

export const PROGRAM_RULE_ACTION_TYPE_OPTIONS =
    PROGRAM_RULE_ACTION_TYPE_VALUES.map((value) => ({
        label: programRuleActionTypeLabels[value] ?? value,
        value,
    }))
