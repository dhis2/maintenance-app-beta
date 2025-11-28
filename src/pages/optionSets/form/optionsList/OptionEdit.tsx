import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import { IconInfo16 } from '@dhis2/ui-icons'
import { useQuery } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import React, { useCallback, useMemo } from 'react'
import { useFormState } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    FormFooterWrapper,
    SectionedFormErrorNotice,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    FormBase,
    FormBaseProps,
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
} from '../../../../lib'
import {
    DisplayableModel,
    PickWithFieldFilters,
    Section,
} from '../../../../types/models'
import styles from './OptionList.module.css'
import { initialOptionValues } from './optionSchema'
import { DrawerState } from './OptionsListTable'

export const OptionFormContents = ({
    onCancel,
}: {
    onCancel: (s: DrawerState) => void
}) => {
    const { submitting, values } = useFormState({
        subscription: { submitting: true, values: true },
    })

    return (
        <div className={styles.sectionsWrapper}>
            <div>
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
                            />
                        </StandardFormField>
                        <StandardFormField>
                            <ColorAndIconField />
                        </StandardFormField>
                    </SectionedFormSection>
                </SectionedFormSections>
                <SectionedFormErrorNotice />
            </div>
            <div>
                <FormFooterWrapper>
                    <ButtonStrip>
                        <Button
                            primary
                            small
                            type="submit"
                            dataTest="form-submit-button"
                            disabled={submitting}
                            loading={submitting}
                        >
                            {i18n.t('Save option')}
                        </Button>
                        <Button
                            secondary
                            small
                            onClick={onCancel}
                            dataTest="form-cancel-link"
                            disabled={submitting}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    </ButtonStrip>
                    <div className={styles.actionsInfo}>
                        <IconInfo16 />
                        <p>
                            {i18n.t(
                                'Saving an option does not save other changes to the option set'
                            )}
                        </p>
                    </div>
                </FormFooterWrapper>
            </div>
        </div>
    )
}

export const fieldFilters = ['name', 'code', 'style[color,icon]'] as const

const optionSchemaSection = {
    name: SchemaName.option,
    namePlural: 'options',
    title: i18n.t('Option'),
    titlePlural: i18n.t('Options'),
    parentSectionKey: 'other',
} satisfies SchemaSection

export type SectionFormValues = PickWithFieldFilters<
    Section,
    typeof fieldFilters
> & {
    dataSet: { id: string }
    displayOptions?: string
}
type PartialSectionFormValues = Partial<SectionFormValues>
type SubmittedSectionFormValues = PartialSectionFormValues & DisplayableModel

export const OptionForm = ({ option, onSubmit, onCancel }: any) => {
    const optionSetId = useParams().id as string

    const initialValues: any | undefined = useMemo(
        () => (option ? option : initialOptionValues),
        [option]
    )

    const valueFormatter = useCallback(
        (values: PartialSectionFormValues) => {
            return {
                ...values,
                optionSet: { id: optionSetId },
            }
        },
        [optionSetId]
    )
    return (
        <FormBase
            initialValues={{ ...initialValues, optionSet: { id: optionSetId } }}
            onSubmit={onSubmit}
            valueFormatter={valueFormatter}
            includeAttributes={false}
            mutators={{ ...arrayMutators }}
        >
            <OptionFormContents onCancel={onCancel} />
        </FormBase>
    )
}

type OnDataSetFormSubmit = FormBaseProps<PartialSectionFormValues>['onSubmit']
export const EditOptionForm = ({
    option,
    onCancel,
    onSubmitted,
}: {
    option: string | undefined
    onCancel: () => void
    onSubmitted: (values: SubmittedSectionFormValues) => void
}) => {
    const handlePatch = usePatchModel(option, optionSchemaSection.namePlural)

    const onFormSubmit: OnDataSetFormSubmit = async (values, form) => {
        const jsonPatchOperations = createJsonPatchOperations({
            values,
            dirtyFields: form.getState().dirtyFields,
            originalValue: form.getState().initialValues,
        })
        const response = await handlePatch(jsonPatchOperations)
        if (response.error) {
            return createFormError(response.error)
        }

        onSubmitted?.({
            ...values,
            id: option,
        })
        return undefined
    }

    const queryFn = useBoundResourceQueryFn()
    const optionValues = useQuery({
        queryFn: queryFn<SectionFormValues>,
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

    if (optionValues.isLoading) {
        return <LoadingSpinner />
    }

    return (
        <OptionForm
            option={optionValues.data}
            onSubmit={onFormSubmit}
            onCancel={onCancel}
        />
    )
}

export const NewOptionForm = ({
    onCancel,
    onSubmitted,
}: {
    onCancel: () => void
    onSubmitted: (values: SubmittedSectionFormValues) => void
}) => {
    const handleCreate = useCreateModel(optionSchemaSection.namePlural)

    const onFormSubmit: OnDataSetFormSubmit = async (values) => {
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
            onCancel={onCancel}
        />
    )
}

export const EditOrNewOptionForm = ({
    option,
    onCancel,
    onSubmitted: onSubmit,
}: {
    option: string | undefined
    onCancel: (s: DrawerState) => void
    onSubmitted: (values: any) => void
}) => {
    if (option === undefined) {
        return <NewOptionForm onSubmitted={onSubmit} onCancel={onCancel} />
    }

    return (
        <EditOptionForm
            option={option}
            onCancel={onCancel}
            onSubmitted={onSubmit}
        />
    )
}
