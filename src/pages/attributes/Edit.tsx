import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import {
    DEFAULT_FIELD_FILTERS,
    SECTIONS_MAP,
    useOnSubmitEdit,
    getSectionPath,
} from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters } from '../../types/generated'
import { Attribute } from '../../types/models'
import { AttributeFormFields, ATTRIBUTE_BOOLEANS, validate } from './form'
import { SectionedFormWrapper } from './SectionedFormWrapper'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_BOOLEANS,
    'name',
    'description',
    'code',
    'shortName',
    'mandatory',
    'unique',
    'valueType',
    'optionSet',
    'sortOrder',
] as const

export type AttributeFormValues = PickWithFieldFilters<
    Attribute,
    typeof fieldFilters
>

export const Component = () => {
    const section = SECTIONS_MAP.attribute
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
    const query = {
        resource: 'attributes',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const attributesQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<AttributeFormValues>,
    })

    return (
        <SectionedFormWrapper
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={attributesQuery.data}
            validate={validate}
            cancelTo={`/${getSectionPath(section)}`}
        >
            <AttributeFormFields initialValues={attributesQuery.data ?? {}} />
        </SectionedFormWrapper>
    )
}
