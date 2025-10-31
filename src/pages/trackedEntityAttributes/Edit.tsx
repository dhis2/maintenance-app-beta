import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import {
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import { DefaultFormFooter } from '../../components/form/DefaultFormFooter'
import { SectionedFormProvider, SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { fieldFilters } from './form/fieldFilters'
import { TrackedEntityAttributeFormDescriptor } from './form/formDescriptor'
import { TrackedEntityAttributeFormContents } from './form/TrackedEntityAttributeFormContents'
import {
    TrackedEntityAttributeFormValues,
    validate,
} from './form/TrackedEntityAttributeFormSchema'

export const Component = () => {
    const modelId = useParams().id as string
    const section = SECTIONS_MAP.trackedEntityAttribute
    const queryFn = useBoundResourceQueryFn()

    const query = {
        resource: 'trackedEntityAttributes',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }

    const trackedEntityAttributeQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<TrackedEntityAttributeFormValues>,
    })
    const initialValues = trackedEntityAttributeQuery.data

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={initialValues}
            validate={validate}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={TrackedEntityAttributeFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <TrackedEntityAttributeFormContents />
                                <DefaultFormFooter />
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )
            }}
        </FormBase>
    )
}
