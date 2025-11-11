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
    DEFAULT_FIELD_FILTERS,
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    SectionedFormProvider,
    SECTIONS_MAP,
    useOnSubmitEdit,
    useBoundResourceQueryFn,
} from '../../lib'
import { PickWithFieldFilters, RelationshipType } from '../../types/generated'
import {
    RelationshipTypeFormDescriptor,
    RelationshipTypeFormFields,
    validateRelationshipType,
} from './form'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'code',
    'description',
    'bidirectional',
    'fromToName',
    'toFromName',
] as const

export type RelationshipTypeFormValues = PickWithFieldFilters<
    RelationshipType,
    typeof fieldFilters
> & { id: string }

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
            onSubmit={useOnSubmitEdit({ modelId, section })}
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
