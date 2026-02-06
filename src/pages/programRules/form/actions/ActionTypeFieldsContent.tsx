/**
 * Renders the form fields for each program rule action type.
 * Split out to keep cognitive complexity low in the main form.
 */
import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React, { ReactNode } from 'react'
import { Field } from 'react-final-form'
import { StandardFormField } from '../../../../components'
import { ProgramRuleAction } from '../../../../types/generated'
import {
    DataElementField,
    DataElementWithOptionSetField,
    ExpressionField,
    LocationField,
    NotificationTemplateField,
    OptionField,
    OptionGroupField,
    ProgramRuleVariableField,
    ProgramStageSectionField,
    ProgramStageSelectField,
    TrackedEntityAttributeField,
    TrackedEntityAttributeWithOptionSetField,
} from '../../fields'
import styles from './ProgramRuleActionForm.module.css'

const AT = ProgramRuleAction.programRuleActionType

type ActionFieldsRenderer = (programId: string) => ReactNode

function displayTextFields(programId: string): ReactNode {
    return (
        <>
            <StandardFormField>
                <LocationField required />
            </StandardFormField>
            <StandardFormField>
                <Field
                    name="content"
                    label={i18n.t('Static text')}
                    component={InputFieldFF}
                    required
                    validate={(value: string | undefined) =>
                        !value?.trim()
                            ? i18n.t('Static text is required')
                            : undefined
                    }
                />
            </StandardFormField>
            <StandardFormField>
                <ExpressionField
                    programId={programId}
                    label={i18n.t(
                        'Expression to evaluate and display after static text.'
                    )}
                />
            </StandardFormField>
        </>
    )
}

function displayKeyValuePairFields(programId: string): ReactNode {
    return (
        <>
            <StandardFormField>
                <LocationField required />
            </StandardFormField>
            <StandardFormField>
                <Field
                    name="content"
                    label={i18n.t('Key label')}
                    component={InputFieldFF}
                    required
                    validate={(value: string | undefined) =>
                        !value?.trim()
                            ? i18n.t('Key label is required')
                            : undefined
                    }
                />
            </StandardFormField>
            <StandardFormField>
                <ExpressionField
                    programId={programId}
                    label={i18n.t(
                        'Expression to evaluate and display as value.'
                    )}
                />
            </StandardFormField>
        </>
    )
}

function hideFieldFields(programId: string): ReactNode {
    const validateDataElement = (value: any, allValues: any) => {
        const hasDE = !!value?.id
        const hasTEA = !!allValues.trackedEntityAttribute?.id
        return !hasDE && !hasTEA
            ? i18n.t(
                  'Select at least one: data element or tracked entity attribute'
              )
            : undefined
    }

    const validateTrackedEntityAttribute = (value: any, allValues: any) => {
        const hasDE = !!allValues.dataElement?.id
        const hasTEA = !!value?.id
        return !hasDE && !hasTEA
            ? i18n.t(
                  'Select at least one: data element or tracked entity attribute'
              )
            : undefined
    }

    return (
        <>
            <StandardFormField>
                <DataElementField
                    programId={programId}
                    label={i18n.t('Data element to hide')}
                    validateField={validateDataElement}
                    disableIfOtherFieldSet="trackedEntityAttribute"
                />
            </StandardFormField>
            <StandardFormField>
                <TrackedEntityAttributeField
                    programId={programId}
                    label={i18n.t('Tracked entity attribute to hide')}
                    validateField={validateTrackedEntityAttribute}
                    disableIfOtherFieldSet="dataElement"
                />
            </StandardFormField>
            <StandardFormField>
                <Field
                    name="content"
                    label={i18n.t('Custom message for blanked field')}
                    component={InputFieldFF}
                />
            </StandardFormField>
        </>
    )
}

function messageActionFields(programId: string, isWarning: boolean): ReactNode {
    const deLabel = isWarning
        ? i18n.t('Data element to display warning next to')
        : i18n.t('Data element to display error next to')
    const teaLabel = isWarning
        ? i18n.t('Tracked entity attribute to display warning next to')
        : i18n.t('Tracked entity attribute to display error next to')
    return (
        <>
            <StandardFormField>
                <DataElementField programId={programId} label={deLabel} />
            </StandardFormField>
            <StandardFormField>
                <TrackedEntityAttributeField
                    programId={programId}
                    label={teaLabel}
                />
            </StandardFormField>
            <StandardFormField>
                <Field
                    name="content"
                    label={i18n.t('Static text')}
                    component={InputFieldFF}
                    required
                    validate={(value: string | undefined) =>
                        !value?.trim()
                            ? i18n.t('Static text is required')
                            : undefined
                    }
                />
            </StandardFormField>
            <StandardFormField>
                <ExpressionField
                    programId={programId}
                    label={i18n.t(
                        'Expression to evaluate and display after static text.'
                    )}
                />
            </StandardFormField>
        </>
    )
}

function setMandatoryFieldFields(programId: string): ReactNode {
    return (
        <>
            <StandardFormField>
                <DataElementField
                    programId={programId}
                    label={i18n.t('Data element to display error next to')}
                />
            </StandardFormField>
            <StandardFormField>
                <TrackedEntityAttributeField
                    programId={programId}
                    label={i18n.t(
                        'Tracked entity attribute to display error next to'
                    )}
                />
            </StandardFormField>
        </>
    )
}

function assignFields(programId: string): ReactNode {
    return (
        <>
            <StandardFormField>
                <DataElementField
                    programId={programId}
                    label={i18n.t('Data element to assign to')}
                />
            </StandardFormField>
            <StandardFormField>
                <TrackedEntityAttributeField
                    programId={programId}
                    label={i18n.t('Tracked entity attribute to assign to')}
                />
            </StandardFormField>
            <StandardFormField>
                <ProgramRuleVariableField programId={programId} />
            </StandardFormField>
            <StandardFormField>
                <ExpressionField
                    programId={programId}
                    label={i18n.t('Expression to evaluate and assign.')}
                    clearable={false}
                />
            </StandardFormField>
        </>
    )
}

function scheduleMessageFields(programId: string): ReactNode {
    return (
        <>
            <StandardFormField>
                <NotificationTemplateField programId={programId} required />
            </StandardFormField>
            <StandardFormField>
                <ExpressionField
                    programId={programId}
                    label={i18n.t('Date to send message.')}
                />
            </StandardFormField>
        </>
    )
}

function hideOptionFields(programId: string): ReactNode {
    return (
        <>
            <StandardFormField>
                <DataElementWithOptionSetField
                    programId={programId}
                    label={i18n.t('Data element')}
                />
            </StandardFormField>
            <StandardFormField>
                <TrackedEntityAttributeWithOptionSetField
                    programId={programId}
                    label={i18n.t('Tracked entity attribute')}
                />
            </StandardFormField>
            <StandardFormField>
                <OptionField label={i18n.t('Option to hide')} required />
            </StandardFormField>
        </>
    )
}

function optionGroupFields(programId: string, label: string): ReactNode {
    return (
        <>
            <StandardFormField>
                <DataElementWithOptionSetField
                    programId={programId}
                    label={i18n.t('Data element')}
                />
            </StandardFormField>
            <StandardFormField>
                <TrackedEntityAttributeWithOptionSetField
                    programId={programId}
                    label={i18n.t('Tracked entity attribute')}
                />
            </StandardFormField>
            <StandardFormField>
                <OptionGroupField label={label} required />
            </StandardFormField>
        </>
    )
}

const ACTION_FIELDS_MAP: Partial<Record<string, ActionFieldsRenderer>> = {
    [AT.DISPLAYTEXT]: displayTextFields,
    [AT.DISPLAYKEYVALUEPAIR]: displayKeyValuePairFields,
    [AT.HIDEFIELD]: hideFieldFields,
    [AT.HIDESECTION]: (programId) => (
        <StandardFormField>
            <ProgramStageSectionField programId={programId} required />
        </StandardFormField>
    ),
    [AT.HIDEPROGRAMSTAGE]: (programId) => (
        <StandardFormField>
            <ProgramStageSelectField
                programId={programId}
                label={i18n.t('Program stage')}
                required
            />
        </StandardFormField>
    ),
    [AT.SHOWWARNING]: (programId) => messageActionFields(programId, true),
    [AT.SHOWERROR]: (programId) => messageActionFields(programId, false),
    [AT.WARNINGONCOMPLETE]: (programId) => messageActionFields(programId, true),
    [AT.ERRORONCOMPLETE]: (programId) => messageActionFields(programId, false),
    [AT.SETMANDATORYFIELD]: setMandatoryFieldFields,
    [AT.ASSIGN]: assignFields,
    [AT.CREATEEVENT]: (programId) => (
        <StandardFormField>
            <ProgramStageSelectField programId={programId} required />
        </StandardFormField>
    ),
    [AT.SENDMESSAGE]: (programId) => (
        <StandardFormField>
            <NotificationTemplateField programId={programId} required />
        </StandardFormField>
    ),
    [AT.SCHEDULEMESSAGE]: scheduleMessageFields,
    [AT.HIDEOPTION]: hideOptionFields,
    [AT.SHOWOPTIONGROUP]: (programId) =>
        optionGroupFields(programId, i18n.t('Option group to show')),
    [AT.HIDEOPTIONGROUP]: (programId) =>
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
