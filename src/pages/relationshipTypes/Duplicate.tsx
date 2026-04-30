import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import { DuplicationNoticeBox } from '../../components/form/DuplicationNoticeBox'
import {
    SectionedFormProvider,
    SECTIONS_MAP,
    useOnSubmitNew,
    useBoundResourceQueryFn,
} from '../../lib'
import {
    RelationshipTypeFormDescriptor,
    RelationshipTypeFormFields,
    RelationshipTypeFormValues,
    fieldFilters,
    validateRelationshipType,
} from './form'

const section = SECTIONS_MAP.relationshipType

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'relationshipTypes',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const relationshipTypeQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<RelationshipTypeFormValues>,
    })

    const initialValues = useMemo(
        () => omit(relationshipTypeQuery.data, 'id'),
        [relationshipTypeQuery.data]
    )

    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validateRelationshipType}
            fetchError={!!relationshipTypeQuery.error}
            subscription={{}}
        >
            {({ handleSubmit }) => (
                <SectionedFormProvider
                    formDescriptor={RelationshipTypeFormDescriptor}
                >
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <form onSubmit={handleSubmit}>
                            <DuplicationNoticeBox section={section} />
                            <RelationshipTypeFormFields />
                            <DefaultFormFooter cancelTo="/relationshipTypes" />
                        </form>
                        <SectionedFormErrorNotice />
                    </SectionedFormLayout>
                </SectionedFormProvider>
            )}
        </FormBase>
    )
}
