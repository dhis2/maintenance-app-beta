import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Box, Button, SingleSelectFieldFF } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useRef } from 'react'
import { Field, useForm, useFormState } from 'react-final-form'
import {
    FormBase,
    FormBaseProps,
    FormFooterWrapper,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../components'
import { LoadingSpinner } from '../../../../components/loading/LoadingSpinner'
import {
    createFormError,
    createJsonPatchOperations,
    useBoundResourceQueryFn,
    useCreateModel,
    usePatchModel,
} from '../../../../lib'
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

const actionFieldFilters = [
    'id',
    'programRuleActionType',
    'priority',
    'content',
    'data',
    'location',
    'dataElement[id,displayName]',
    'trackedEntityAttribute[id,displayName]',
    'programStage[id,displayName]',
    'programStageSection[id,displayName]',
    'option[id,displayName]',
    'optionGroup[id,displayName]',
    'notificationTemplate[id,displayName]',
] as const

export const ProgramRuleActionForm = ({
    programId,
    action,
    onCancel,
    onSubmit,
}: Readonly<{
    programId?: string
    action: ProgramRuleActionListItem | null
    onCancel: () => void
    onSubmit: FormBaseProps<ProgramRuleActionFormValues>['onSubmit']
}>) => {
    const initialValues = (action ?? {}) as ProgramRuleActionFormValues

    return (
        <FormBase
            key={action?.id ?? 'new'}
            onSubmit={onSubmit}
            initialValues={initialValues}
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

export const EditProgramRuleActionForm = ({
    action,
    programId,
    onCancel,
    onSubmitted,
}: {
    action: ProgramRuleActionListItem
    programId?: string
    onCancel: () => void
    onSubmitted: (values: ProgramRuleActionListItem) => void
}) => {
    const handlePatch = usePatchModel(action.id, 'programRuleActions')
    const queryFn = useBoundResourceQueryFn()
    const { show: showSuccess } = useAlert(
        i18n.t('Program rule action saved'),
        { success: true }
    )

    const actionValues = useQuery({
        queryFn: queryFn<ProgramRuleActionFormValues>,
        queryKey: [
            {
                resource: 'programRuleActions',
                id: action.id,
                params: {
                    fields: actionFieldFilters.concat(),
                },
            },
        ],
    })

    const onFormSubmit: FormBaseProps<ProgramRuleActionFormValues>['onSubmit'] =
        async (values, form) => {
            const jsonPatchOperations = createJsonPatchOperations({
                values,
                dirtyFields: form.getState().dirtyFields,
                originalValue: form.getState().initialValues,
            })

            if (jsonPatchOperations.length > 0) {
                const response = await handlePatch(jsonPatchOperations)
                if (response.error) {
                    return createFormError(response.error)
                }
            }

            showSuccess({ success: true })
            onSubmitted({
                ...values,
                id: action.id,
            } as ProgramRuleActionListItem)
            return undefined
        }

    if (actionValues.isLoading) {
        return <LoadingSpinner />
    }

    return (
        <ProgramRuleActionForm
            programId={programId}
            action={(actionValues.data ?? action) as ProgramRuleActionListItem}
            onCancel={onCancel}
            onSubmit={onFormSubmit}
        />
    )
}

export const NewProgramRuleActionForm = ({
    programId,
    programRuleId,
    onCancel,
    onSubmitted,
}: {
    programId?: string
    programRuleId: string
    onCancel: () => void
    onSubmitted: (values: ProgramRuleActionListItem) => void
}) => {
    const handleCreate = useCreateModel('programRuleActions')

    const onFormSubmit: FormBaseProps<ProgramRuleActionFormValues>['onSubmit'] =
        async (values) => {
            const res = await handleCreate({
                ...values,
                programRule: { id: programRuleId },
            })
            if (res.error) {
                return createFormError(res.error)
            }
            const newId = (res.data as { response: { uid: string } }).response
                .uid
            onSubmitted({
                ...values,
                id: newId,
            } as ProgramRuleActionListItem)
            return undefined
        }

    return (
        <ProgramRuleActionForm
            programId={programId}
            action={null}
            onCancel={onCancel}
            onSubmit={onFormSubmit}
        />
    )
}

export const EditOrNewProgramRuleActionForm = ({
    action,
    programId,
    programRuleId,
    onCancel,
    onSubmitted,
}: {
    action: ProgramRuleActionListItem | null | undefined
    programId?: string
    programRuleId: string
    onCancel: () => void
    onSubmitted: (values: ProgramRuleActionListItem) => void
}) => {
    if (action === undefined) {
        return null
    }

    if (action === null) {
        return (
            <NewProgramRuleActionForm
                programId={programId}
                programRuleId={programRuleId}
                onCancel={onCancel}
                onSubmitted={onSubmitted}
            />
        )
    }

    return (
        <EditProgramRuleActionForm
            action={action}
            programId={programId}
            onCancel={onCancel}
            onSubmitted={onSubmitted}
        />
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
