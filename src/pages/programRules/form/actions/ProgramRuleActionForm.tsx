import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    InputFieldFF,
    SingleSelectFieldFF,
} from '@dhis2/ui'
import React from 'react'
import { Field, useFormState } from 'react-final-form'
import {
    FormBase,
    FormFooterWrapper,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import { ProgramRuleAction } from '../../../../types/generated'
import {
    DataElementField,
    DataElementWithOptionSetField,
    ExpressionField,
    LocationField,
    NotificationTemplateField,
    OptionField,
    OptionGroupField,
    PriorityField,
    ProgramRuleVariableField,
    ProgramStageSectionField,
    ProgramStageSelectField,
    TrackedEntityAttributeField,
    TrackedEntityAttributeWithOptionSetField,
} from '../../fields'
import styles from './ProgramRuleActionForm.module.css'
import type { ProgramRuleActionListItem } from './types'

const ACTION_TYPE_OPTIONS = [
    {
        label: i18n.t('Assign value'),
        value: ProgramRuleAction.programRuleActionType.ASSIGN,
    },
    {
        label: i18n.t('Create event'),
        value: ProgramRuleAction.programRuleActionType.CREATEEVENT,
    },
    {
        label: i18n.t('Display key-value pair'),
        value: ProgramRuleAction.programRuleActionType.DISPLAYKEYVALUEPAIR,
    },
    {
        label: i18n.t('Display text'),
        value: ProgramRuleAction.programRuleActionType.DISPLAYTEXT,
    },
    {
        label: i18n.t('Error on complete'),
        value: ProgramRuleAction.programRuleActionType.ERRORONCOMPLETE,
    },
    {
        label: i18n.t('Hide field'),
        value: ProgramRuleAction.programRuleActionType.HIDEFIELD,
    },
    {
        label: i18n.t('Hide option'),
        value: ProgramRuleAction.programRuleActionType.HIDEOPTION,
    },
    {
        label: i18n.t('Hide option group'),
        value: ProgramRuleAction.programRuleActionType.HIDEOPTIONGROUP,
    },
    {
        label: i18n.t('Hide program stage'),
        value: ProgramRuleAction.programRuleActionType.HIDEPROGRAMSTAGE,
    },
    {
        label: i18n.t('Hide section'),
        value: ProgramRuleAction.programRuleActionType.HIDESECTION,
    },
    {
        label: i18n.t('Schedule message'),
        value: ProgramRuleAction.programRuleActionType.SCHEDULEMESSAGE,
    },
    {
        label: i18n.t('Send message'),
        value: ProgramRuleAction.programRuleActionType.SENDMESSAGE,
    },
    {
        label: i18n.t('Set mandatory field'),
        value: ProgramRuleAction.programRuleActionType.SETMANDATORYFIELD,
    },
    {
        label: i18n.t('Show error'),
        value: ProgramRuleAction.programRuleActionType.SHOWERROR,
    },
    {
        label: i18n.t('Show option group'),
        value: ProgramRuleAction.programRuleActionType.SHOWOPTIONGROUP,
    },
    {
        label: i18n.t('Show warning'),
        value: ProgramRuleAction.programRuleActionType.SHOWWARNING,
    },
    {
        label: i18n.t('Warning on complete'),
        value: ProgramRuleAction.programRuleActionType.WARNINGONCOMPLETE,
    },
].sort((a, b) => a.label.localeCompare(b.label))

type ProgramRuleActionFormValues = Partial<ProgramRuleActionListItem> & {
    programRule?: { id: string }
}

const initialValuesNew = (
    programRuleId: string
): ProgramRuleActionFormValues => ({
    programRuleActionType: ProgramRuleAction.programRuleActionType.SHOWWARNING,
    priority: undefined,
    content: '',
    data: '',
    programRule: { id: programRuleId },
})

export const ProgramRuleActionForm = ({
    programRuleId,
    programId,
    action,
    onCancel,
    onSubmitted,
}: Readonly<{
    programRuleId: string
    programId?: string
    action: ProgramRuleActionListItem | null
    onCancel: () => void
    onSubmitted: (values: ProgramRuleActionListItem) => void
}>) => {
    const initialValues: ProgramRuleActionFormValues = action
        ? { ...action, programRule: { id: programRuleId } }
        : initialValuesNew(programRuleId)

    return (
        <FormBase
            onSubmit={(values) => {
                const submitted = {
                    ...values,
                    programRule: undefined,
                } as ProgramRuleActionListItem
                onSubmitted(submitted)
            }}
            initialValues={initialValues}
            subscription={{}}
            includeAttributes={false}
        >
            {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <div className={styles.sectionsWrapper}>
                        <div>
                            <StandardFormSection>
                                <StandardFormSectionTitle>
                                    {action
                                        ? i18n.t('Edit action')
                                        : i18n.t('Add action')}
                                </StandardFormSectionTitle>
                                <StandardFormSectionDescription>
                                    {i18n.t(
                                        'Configure the program rule action.'
                                    )}
                                </StandardFormSectionDescription>

                                <StandardFormField>
                                    <Field
                                        name="programRuleActionType"
                                        label={i18n.t('Action type')}
                                        component={SingleSelectFieldFF}
                                        options={ACTION_TYPE_OPTIONS}
                                        required
                                        filterable
                                    />
                                </StandardFormField>

                                <StandardFormField>
                                    <PriorityField />
                                </StandardFormField>

                                <ActionTypeFields programId={programId} />
                            </StandardFormSection>
                        </div>

                        <FormFooterWrapper>
                            <ButtonStrip>
                                <Button primary type="submit">
                                    {action
                                        ? i18n.t('Save action')
                                        : i18n.t('Add action')}
                                </Button>
                                <Button secondary onClick={onCancel}>
                                    {i18n.t('Cancel')}
                                </Button>
                            </ButtonStrip>
                        </FormFooterWrapper>
                    </div>
                </form>
            )}
        </FormBase>
    )
}

function ActionTypeFields({ programId }: { programId?: string }) {
    const { values } = useFormState({ subscription: { values: true } })
    const actionType = (values as ProgramRuleActionFormValues)
        .programRuleActionType

    if (!programId) {
        return null
    }

    const AT = ProgramRuleAction.programRuleActionType

    // DISPLAYTEXT
    if (actionType === AT.DISPLAYTEXT) {
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

    // DISPLAYKEYVALUEPAIR
    if (actionType === AT.DISPLAYKEYVALUEPAIR) {
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

    // HIDEFIELD
    if (actionType === AT.HIDEFIELD) {
        return (
            <>
                <StandardFormField>
                    <DataElementField
                        programId={programId}
                        label={i18n.t('Data element to hide')}
                    />
                </StandardFormField>
                <StandardFormField>
                    <TrackedEntityAttributeField
                        programId={programId}
                        label={i18n.t('Tracked entity attribute to hide')}
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

    // HIDESECTION
    if (actionType === AT.HIDESECTION) {
        return (
            <StandardFormField>
                <ProgramStageSectionField programId={programId} required />
            </StandardFormField>
        )
    }

    // HIDEPROGRAMSTAGE
    if (actionType === AT.HIDEPROGRAMSTAGE) {
        return (
            <StandardFormField>
                <ProgramStageSelectField programId={programId} required />
            </StandardFormField>
        )
    }

    // SHOWWARNING, SHOWERROR, WARNINGONCOMPLETE, ERRORONCOMPLETE
    if (
        actionType === AT.SHOWWARNING ||
        actionType === AT.SHOWERROR ||
        actionType === AT.WARNINGONCOMPLETE ||
        actionType === AT.ERRORONCOMPLETE
    ) {
        const isWarning =
            actionType === AT.SHOWWARNING || actionType === AT.WARNINGONCOMPLETE
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

    // SETMANDATORYFIELD
    if (actionType === AT.SETMANDATORYFIELD) {
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

    // ASSIGN
    if (actionType === AT.ASSIGN) {
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

    // CREATEEVENT
    if (actionType === AT.CREATEEVENT) {
        return (
            <StandardFormField>
                <ProgramStageSelectField programId={programId} required />
            </StandardFormField>
        )
    }

    // SENDMESSAGE
    if (actionType === AT.SENDMESSAGE) {
        return (
            <StandardFormField>
                <NotificationTemplateField programId={programId} required />
            </StandardFormField>
        )
    }

    // SCHEDULEMESSAGE
    if (actionType === AT.SCHEDULEMESSAGE) {
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

    // HIDEOPTION
    if (actionType === AT.HIDEOPTION) {
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

    // SHOWOPTIONGROUP, HIDEOPTIONGROUP
    if (
        actionType === AT.SHOWOPTIONGROUP ||
        actionType === AT.HIDEOPTIONGROUP
    ) {
        const ogLabel =
            actionType === AT.SHOWOPTIONGROUP
                ? i18n.t('Option group to show')
                : i18n.t('Option group to hide')

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
                    <OptionGroupField label={ogLabel} required />
                </StandardFormField>
            </>
        )
    }

    return null
}
