import i18n from '@dhis2/d2-i18n'
import { Box, Button, SingleSelectFieldFF } from '@dhis2/ui'
import React, { useEffect, useRef } from 'react'
import { Field, useForm, useFormState } from 'react-final-form'
import {
    FormBase,
    FormFooterWrapper,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import {
    FEATURES,
    useFeatureAvailable,
} from '../../../../lib/featuresApiSupport'
import { useClearFormFields } from '../../../../lib/form/useClearFormFields'
import { PriorityField } from '../../fields'
import { ActionTypeFieldsContent } from './ActionTypeFieldsContent'
import { ACTION_FIELDS_TO_CLEAR, ACTION_TYPE_OPTIONS } from './constants'
import styles from './ProgramRuleActionForm.module.css'
import type {
    ProgramRuleActionListItem,
    ProgramRuleActionFormValues,
} from './types'
import { validateProgramRuleAction } from './validation'

export const ProgramRuleActionForm = ({
    programId,
    action,
    onCancel,
    onSubmitted,
}: Readonly<{
    programId?: string
    action: ProgramRuleActionListItem | null
    onCancel: () => void
    onSubmitted: (values: ProgramRuleActionListItem) => void
}>) => {
    const handleSubmit = (values: ProgramRuleActionFormValues) => {
        const submitted = {
            ...values,
            programRule: undefined,
        } as ProgramRuleActionListItem
        onSubmitted(submitted)
    }

    const formInitialValues = action || {}

    return (
        <FormBase
            onSubmit={handleSubmit}
            initialValues={formInitialValues}
            validate={validateProgramRuleAction}
            validateOnBlur={false}
            includeAttributes={false}
        >
            <ProgramRuleActionFormBody
                action={action}
                onCancel={onCancel}
                programId={programId}
            />
        </FormBase>
    )
}

function ProgramRuleActionFormBody({
    action,
    onCancel,
    programId,
}: Readonly<{
    action: ProgramRuleActionListItem | null
    onCancel: () => void
    programId?: string
}>) {
    const form = useForm()
    const clearActionFields = useClearFormFields(
        form,
        ...ACTION_FIELDS_TO_CLEAR
    )
    const { values } = useFormState({ subscription: { values: true } })
    const actionType = (values as ProgramRuleActionFormValues)
        .programRuleActionType
    const previousActionTypeRef = useRef<string | undefined>(undefined)

    useEffect(() => {
        if (
            previousActionTypeRef.current !== undefined &&
            previousActionTypeRef.current !== actionType
        ) {
            clearActionFields()
        }
        previousActionTypeRef.current = actionType
    }, [actionType, clearActionFields])

    const isEdit = !!action
    const priorityFieldAvailable = useFeatureAvailable(
        FEATURES.programRuleActionPriority
    )

    return (
        <div className={styles.sectionsWrapper}>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {isEdit ? i18n.t('Edit action') : i18n.t('Add action')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Configure the program rule action.')}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <Field name="programRuleActionType">
                        {({ input, meta }) => (
                            <Box width="400px" minWidth="100px">
                                <SingleSelectFieldFF
                                    input={input}
                                    meta={meta}
                                    label={i18n.t('Action type')}
                                    options={ACTION_TYPE_OPTIONS}
                                    required
                                    filterable
                                />
                            </Box>
                        )}
                    </Field>
                </StandardFormField>

                {priorityFieldAvailable && (
                    <StandardFormField>
                        <PriorityField />
                    </StandardFormField>
                )}

                {programId && (
                    <ActionTypeFieldsContent
                        programId={programId}
                        actionType={actionType}
                    />
                )}
            </StandardFormSection>

            <FormFooterWrapper>
                <Button primary type="submit">
                    {isEdit ? i18n.t('Save action') : i18n.t('Add action')}
                </Button>
                <Button secondary onClick={onCancel}>
                    {i18n.t('Cancel')}
                </Button>
            </FormFooterWrapper>
        </div>
    )
}
