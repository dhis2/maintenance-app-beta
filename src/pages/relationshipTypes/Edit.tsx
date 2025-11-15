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
    SectionedFormProvider,
    SECTIONS_MAP,
    useOnSubmitEdit,
    useBoundResourceQueryFn,
} from '../../lib'
import {
    RelationshipTypeFormDescriptor,
    RelationshipTypeFormFields,
    RelationshipTypeFormValues,
    fieldFilters,
    validateRelationshipType,
} from './form'

export const Component = () => {
    const section = SECTIONS_MAP.relationshipType
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string

    const query = {
        resource: 'relationshipTypes',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const relationshipType = useQuery({
        queryKey: [query],
        queryFn: queryFn<RelationshipTypeFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({section, modelId})}
            initialValues={relationshipType.data}
            validate={validateRelationshipType}
            subscription={{}}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={RelationshipTypeFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <RelationshipTypeFormFields />
                                <DefaultFormFooter cancelTo="/relationshipTypes" />
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )
            }}
        </FormBase>
    )
}
