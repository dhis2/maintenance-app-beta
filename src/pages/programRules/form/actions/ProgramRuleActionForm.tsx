import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, SingleSelectFieldFF } from '@dhis2/ui'
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
import { PriorityField } from '../../fields'
import { ActionTypeFieldsContent } from './ActionTypeFieldsContent'
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

function ActionTypeFields({ programId }: Readonly<{ programId?: string }>) {
    const { values } = useFormState({ subscription: { values: true } })
    const actionType = (values as ProgramRuleActionFormValues)
        .programRuleActionType

    if (!programId) {
        return null
    }

    return (
        <ActionTypeFieldsContent
            programId={programId}
            actionType={actionType}
        />
    )
}
