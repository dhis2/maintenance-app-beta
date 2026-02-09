import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ProgramRuleAction } from '../../../../types/generated'
import {
    type ActionFieldsRenderer,
    assignFields,
    createEventFields,
    displayKeyValuePairFields,
    displayTextFields,
    hideFieldFields,
    hideOptionFields,
    hideProgramStageFields,
    hideSectionFields,
    messageActionFields,
    optionGroupFields,
    scheduleMessageFields,
    sendMessageFields,
    setMandatoryFieldFields,
} from './actionContent'

const ACTION_TYPE = ProgramRuleAction.programRuleActionType

const ACTION_FIELDS_MAP: Partial<Record<string, ActionFieldsRenderer>> = {
    [ACTION_TYPE.DISPLAYTEXT]: displayTextFields,
    [ACTION_TYPE.DISPLAYKEYVALUEPAIR]: displayKeyValuePairFields,
    [ACTION_TYPE.HIDEFIELD]: hideFieldFields,
    [ACTION_TYPE.HIDESECTION]: hideSectionFields,
    [ACTION_TYPE.HIDEPROGRAMSTAGE]: hideProgramStageFields,
    [ACTION_TYPE.SHOWWARNING]: (programId) =>
        messageActionFields(programId, true),
    [ACTION_TYPE.SHOWERROR]: (programId) =>
        messageActionFields(programId, false),
    [ACTION_TYPE.WARNINGONCOMPLETE]: (programId) =>
        messageActionFields(programId, true),
    [ACTION_TYPE.ERRORONCOMPLETE]: (programId) =>
        messageActionFields(programId, false),
    [ACTION_TYPE.SETMANDATORYFIELD]: setMandatoryFieldFields,
    [ACTION_TYPE.ASSIGN]: assignFields,
    [ACTION_TYPE.CREATEEVENT]: createEventFields,
    [ACTION_TYPE.SENDMESSAGE]: sendMessageFields,
    [ACTION_TYPE.SCHEDULEMESSAGE]: scheduleMessageFields,
    [ACTION_TYPE.HIDEOPTION]: hideOptionFields,
    [ACTION_TYPE.SHOWOPTIONGROUP]: (programId) =>
        optionGroupFields(programId, i18n.t('Option group to show')),
    [ACTION_TYPE.HIDEOPTIONGROUP]: (programId) =>
        optionGroupFields(programId, i18n.t('Option group to hide')),
}

export function ActionTypeFieldsContent({
    programId,
    actionType,
}: Readonly<{
    programId: string
    actionType: string | undefined
}>) {
    const render = actionType ? ACTION_FIELDS_MAP[actionType] : undefined
    return render ? <>{render(programId)}</> : null
}
