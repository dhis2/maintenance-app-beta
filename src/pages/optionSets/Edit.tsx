import { useDataEngine } from '@dhis2/app-runtime'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import { DrawerRoot } from '../../components/drawer/Drawer'
import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
    SectionedFormProvider,
    SECTIONS_MAP,
    useOnSubmitEdit,
} from '../../lib'
import { EnhancedOnSubmit } from '../../lib/form/useOnSubmit'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PlainResourceQuery } from '../../types'
import { PickWithFieldFilters } from '../../types/generated'
import { OptionSet } from '../../types/models'
import { OptionSetFormDescriptor } from './form/formDescriptor'
import { OptionSetFormContents } from './form/OptionSetFormContents'
import { validate } from './form/optionSetSchema'
import { useHandleOnSubmitEditOptionSetsDeletions } from './form/optionsList/useHandleOnSubmitEditOptionSetsDeletions'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'displayName',
    'description',
    'code',
    'valueType',
    'options[id,name,code,access]',
] as const

const section = SECTIONS_MAP.optionSet

export type OptionSetFormValues = PickWithFieldFilters<
    OptionSet,
    typeof fieldFilters
>

export type OptionSetFormValuesExpanded = OptionSetFormValues & {
    options?: { id: string }[]
}

export const useOnSubmitOptionsSetsEdit = (modelId: string) => {
    const submitEdit: EnhancedOnSubmit<OptionSetFormValuesExpanded> =
        useOnSubmitEdit({
            section,
            modelId,
        })
    const dataEngine = useDataEngine()
    const queryClient = useQueryClient()

    const handleDeletions = useHandleOnSubmitEditOptionSetsDeletions(
        section,
        'options',
        dataEngine,
        queryClient,
        modelId
    )

    return useMemo<EnhancedOnSubmit<OptionSetFormValuesExpanded>>(
        () => async (values, form, submitOptions) => {
            const formValues = form.getState().values
            const { options, ...otherValues } = formValues

            const { error } = await handleDeletions(options ?? [])

            const nonDeletedOptions = (options ?? []).filter(
                (option: { id: string; deleted?: boolean }) => !option?.deleted
            )

            if (error) {
                return error
            }
            // any options that have not been deleted should be posted to update sort order
            const trimmedValues = {
                ...otherValues,
                options: nonDeletedOptions.length > 0 ? nonDeletedOptions : [],
            } as OptionSetFormValuesExpanded

            // if options have been deleted, update form state to remove deleted options
            if (options?.length !== nonDeletedOptions.length) {
                form.change('options', nonDeletedOptions)
            }

            return submitEdit(trimmedValues, form, submitOptions)
        },
        [submitEdit, handleDeletions]
    )
}

export const Component = () => {
    const modelId = useParams().id as string
    const queryFn = useBoundResourceQueryFn()

    const optionSetQuery = useQuery({
        queryKey: [
            {
                resource: 'optionSets',
                id: modelId,
                params: { fields: fieldFilters.concat() },
            } satisfies PlainResourceQuery,
        ],
        queryFn: queryFn<OptionSetFormValues>,
    })
    const initialValues = optionSetQuery.data

    return (
        <FormBase
            onSubmit={
                useOnSubmitOptionsSetsEdit(modelId) as EnhancedOnSubmit<any>
            }
            initialValues={initialValues}
            validate={validate}
            subscription={{}}
        >
            {({ handleSubmit }) => (
                <SectionedFormProvider formDescriptor={OptionSetFormDescriptor}>
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <form onSubmit={handleSubmit}>
                            <OptionSetFormContents />
                            <DefaultFormFooter cancelTo="/optionSets" />
                        </form>
                        <DrawerRoot />
                        <SectionedFormErrorNotice />
                    </SectionedFormLayout>
                </SectionedFormProvider>
            )}
        </FormBase>
    )
}
