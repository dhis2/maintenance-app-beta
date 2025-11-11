import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
    SectionedFormProvider,
    SECTIONS_MAP,
    useOnSubmitEdit,
} from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PlainResourceQuery } from '../../types'
import { OptionSetFormDescriptor } from './form/formDescriptor'
import { OptionSetFormContents } from './form/OptionSetFormContents'
import { OptionSetFormValues, validate } from './form/optionSetSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'displayName',
    'code',
    'valueType',
    'options[id,code,displayName,sortOrder,style]',
] as const

export const Component = () => {
    const modelId = useParams().id as string
    const section = SECTIONS_MAP.optionSet
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
            onSubmit={useOnSubmitEdit({ section, modelId })}
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
                        <SectionedFormErrorNotice />
                    </SectionedFormLayout>
                </SectionedFormProvider>
            )}
        </FormBase>
    )
}
