import i18n from '@dhis2/d2-i18n'
import { useQuery } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useForm, useFormState } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    SectionedFormErrorNotice,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    FormBase,
    FormBaseProps,
    CustomAttributesSection,
} from '../../../../components'
import {
    NameField,
    CodeField,
    ColorAndIconField,
} from '../../../../components/form/fields'
import { LoadingSpinner } from '../../../../components/loading/LoadingSpinner'
import {
    SchemaName,
    SchemaSection,
    useBoundResourceQueryFn,
    usePatchModel,
    createFormError,
    createJsonPatchOperations,
    useCreateModel,
    ATTRIBUTE_VALUES_FIELD_FILTERS,
} from '../../../../lib'
import { Option } from '../../../../types/generated'
import { PickWithFieldFilters } from '../../../../types/models'
import { initialOptionValues } from './optionSchema'

export type OptionFormActions = {
    save: () => void
    submitting: boolean
}

const OptionFormContentsInner = ({
    onActionsReadyRef,
}: {
    onActionsReadyRef: React.RefObject<
        ((actions: OptionFormActions) => void) | undefined
    >
}) => {
    const form = useForm()
    const { submitting } = useFormState({
        subscription: { submitting: true },
    })

    useEffect(() => {
        onActionsReadyRef.current?.({
            save: () => {
                form.submit()
            },
            submitting: submitting ?? false,
        })
    }, [form, submitting, onActionsReadyRef])

    return <OptionFormContents />
}

const OptionFormContents = () => {
    const { values } = useFormState({
        subscription: { values: true },
    })

    return (
        <SectionedFormSections>
            <SectionedFormSection name="optionEdit">
                <StandardFormSectionTitle>
                    {i18n.t('Option')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Set up the information for this option.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <NameField
                        schemaSection={optionSchemaSection}
                        modelId={values.id}
                    />
                </StandardFormField>
                <StandardFormField>
                    <CodeField
                        schemaSection={optionSchemaSection}
                        modelId={values.id}
                        required={true}
                    />
                </StandardFormField>
                <StandardFormField>
                    <ColorAndIconField />
                </StandardFormField>
            </SectionedFormSection>
            <CustomAttributesSection schemaSection={optionSchemaSection} />
        </SectionedFormSections>
    )
}

export const fieldFilters = [
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'code',
    'style[color,icon]',
    'id',
] as const

const optionSchemaSection = {
    name: SchemaName.option,
    namePlural: 'options',
    title: i18n.t('Option'),
    titlePlural: i18n.t('Options'),
    parentSectionKey: 'other',
} satisfies SchemaSection

export type OptionFormValues = PickWithFieldFilters<
    Option,
    typeof fieldFilters
> & {
    optionSet?: { id: string }
}

export type SubmittedOptionFormValues = Partial<OptionFormValues>

type OptionFormProps = {
    option?: SubmittedOptionFormValues
    onSubmit: FormBaseProps<SubmittedOptionFormValues>['onSubmit']
    onActionsReady?: (actions: OptionFormActions) => void
}

export const OptionForm = ({
    option,
    onSubmit,
    onActionsReady,
}: OptionFormProps) => {
    const optionSetId = useParams().id as string

    const initialValues: SubmittedOptionFormValues | undefined = useMemo(
        () => option ?? (initialOptionValues as SubmittedOptionFormValues),
        [option]
    )

    const valueFormatter = useCallback(
        (values: SubmittedOptionFormValues) => {
            return {
                ...values,
                optionSet: { id: optionSetId },
            }
        },
        [optionSetId]
    )

    const onActionsReadyRef = React.useRef(onActionsReady)
    onActionsReadyRef.current = onActionsReady

    return (
        <FormBase
            modelName={optionSchemaSection.name}
            initialValues={{ ...initialValues, optionSet: { id: optionSetId } }}
            onSubmit={onSubmit}
            valueFormatter={valueFormatter}
            includeAttributes={true}
            mutators={{ ...arrayMutators }}
        >
            <OptionFormContentsInner onActionsReadyRef={onActionsReadyRef} />
            <SectionedFormErrorNotice />
        </FormBase>
    )
}

type OnOptionFormSubmit = FormBaseProps<SubmittedOptionFormValues>['onSubmit']
export const EditOptionForm = ({
    option,
    onSubmitted,
    onActionsReady,
}: {
    option: string | undefined
    onSubmitted: (values: SubmittedOptionFormValues) => void
    onActionsReady?: (actions: OptionFormActions) => void
}) => {
    const handlePatch = usePatchModel(
        option ?? '',
        optionSchemaSection.namePlural
    )

    const onFormSubmit: OnOptionFormSubmit = async (values, form) => {
        const jsonPatchOperations = createJsonPatchOperations({
            values,
            dirtyFields: form.getState().dirtyFields,
            originalValue: form.getState().initialValues,
        })
        const response = await handlePatch(jsonPatchOperations)
        if (response.error) {
            return createFormError(response.error)
        }

        onSubmitted?.(values)
        return undefined
    }

    const queryFn = useBoundResourceQueryFn()
    const optionValues = useQuery({
        queryFn: queryFn<OptionFormValues>,
        queryKey: [
            {
                resource: 'options',
                id: option,
                params: {
                    fields: fieldFilters.concat(),
                },
            },
        ],
    })

    if (!option) {
        return null
    }

    if (optionValues.isLoading) {
        return <LoadingSpinner />
    }

    return (
        <OptionForm
            option={optionValues.data}
            onSubmit={onFormSubmit}
            onActionsReady={onActionsReady}
        />
    )
}

export const NewOptionForm = ({
    onSubmitted,
    onActionsReady,
}: {
    onSubmitted: (values: SubmittedOptionFormValues) => void
    onActionsReady?: (actions: OptionFormActions) => void
}) => {
    const handleCreate = useCreateModel(optionSchemaSection.namePlural)

    const onFormSubmit: OnOptionFormSubmit = async (values) => {
        const res = await handleCreate(values)
        if (res.error) {
            return createFormError(res.error)
        }
        const newId = (res.data as { response: { uid: string } }).response.uid

        onSubmitted?.({
            ...values,
            id: newId,
        })
        return undefined
    }

    return (
        <OptionForm
            option={undefined}
            onSubmit={onFormSubmit}
            onActionsReady={onActionsReady}
        />
    )
}

export const EditOrNewOptionForm = ({
    option,
    onSubmitted: onSubmit,
    onActionsReady,
}: {
    option: string | undefined
    onSubmitted: (values: SubmittedOptionFormValues) => void
    onActionsReady?: (actions: OptionFormActions) => void
}) => {
    if (option === undefined) {
        return (
            <NewOptionForm
                onSubmitted={onSubmit}
                onActionsReady={onActionsReady}
            />
        )
    }

    return (
        <EditOptionForm
            option={option}
            onSubmitted={onSubmit}
            onActionsReady={onActionsReady}
        />
    )
}
