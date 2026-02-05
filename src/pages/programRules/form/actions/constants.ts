import i18n from '@dhis2/d2-i18n'
import { ProgramRuleAction } from '../../../../types/generated'

export const ACTION_FIELDS_TO_CLEAR = [
    'content',
    'data',
    'dataElement',
    'location',
    'option',
    'optionGroup',
    'priority',
    'programStage',
    'programStageSection',
    'templateUid',
    'trackedEntityAttribute',
] as const

const { programRuleActionType } = ProgramRuleAction

export const ACTION_TYPE_OPTIONS = [
    { label: i18n.t('Assign value'), value: programRuleActionType.ASSIGN },
    { label: i18n.t('Create event'), value: programRuleActionType.CREATEEVENT },
    {
        label: i18n.t('Display key-value pair'),
        value: programRuleActionType.DISPLAYKEYVALUEPAIR,
    },
    { label: i18n.t('Display text'), value: programRuleActionType.DISPLAYTEXT },
    {
        label: i18n.t('Error on complete'),
        value: programRuleActionType.ERRORONCOMPLETE,
    },
    { label: i18n.t('Hide field'), value: programRuleActionType.HIDEFIELD },
    { label: i18n.t('Hide option'), value: programRuleActionType.HIDEOPTION },
    {
        label: i18n.t('Hide option group'),
        value: programRuleActionType.HIDEOPTIONGROUP,
    },
    {
        label: i18n.t('Hide program stage'),
        value: programRuleActionType.HIDEPROGRAMSTAGE,
    },
    { label: i18n.t('Hide section'), value: programRuleActionType.HIDESECTION },
    {
        label: i18n.t('Schedule message'),
        value: programRuleActionType.SCHEDULEMESSAGE,
    },
    {
        label: i18n.t('Send message'),
        value: programRuleActionType.SENDMESSAGE,
    },
    {
        label: i18n.t('Set mandatory field'),
        value: programRuleActionType.SETMANDATORYFIELD,
    },
    { label: i18n.t('Show error'), value: programRuleActionType.SHOWERROR },
    {
        label: i18n.t('Show option group'),
        value: programRuleActionType.SHOWOPTIONGROUP,
    },
    { label: i18n.t('Show warning'), value: programRuleActionType.SHOWWARNING },
    {
        label: i18n.t('Warning on complete'),
        value: programRuleActionType.WARNINGONCOMPLETE,
    },
].sort((a, b) => a.label.localeCompare(b.label))

export const VALIDATION_MESSAGES = {
    HIDEFIELD: i18n.t(
        'Select at least one: data element or tracked entity attribute'
    ),
    HIDEOPTION_DE_TEA: i18n.t(
        'Select a data element or tracked entity attribute with option set'
    ),
    HIDEOPTION_OPTION: i18n.t('Option to hide is required'),
    SETMANDATORYFIELD: i18n.t(
        'Select at least one: data element or tracked entity attribute'
    ),
    ASSIGN_TARGET: i18n.t(
        'Select at least one: data element, tracked entity attribute, or program rule variable'
    ),
    ASSIGN_EXPRESSION: i18n.t('Expression to evaluate and assign is required'),
    OPTIONGROUP_DE_TEA: i18n.t(
        'Select a data element or tracked entity attribute with option set'
    ),
    OPTIONGROUP_GROUP: i18n.t('Option group is required'),
    DISPLAY_WIDGET: i18n.t('Display widget is required'),
} as const
