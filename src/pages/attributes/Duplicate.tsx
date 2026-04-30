import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DuplicationNoticeBox } from '../../components/form/DuplicationNoticeBox'
import {
    DEFAULT_FIELD_FILTERS,
    SECTIONS_MAP,
    useOnSubmitNew,
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

type AttributeFormValues = PickWithFieldFilters<Attribute, typeof fieldFilters>

const section = SECTIONS_MAP.attribute

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'attributes',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const attributesQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<AttributeFormValues>,
    })
    const duplicateData = useMemo(
        () => omit(attributesQuery.data, 'id'),
        [attributesQuery.data]
    )

    return (
        <SectionedFormWrapper
            onSubmit={useOnSubmitNew({ section })}
            initialValues={duplicateData as Attribute}
            validate={validate}
            cancelTo={`/${getSectionPath(section)}`}
            fetchError={!!attributesQuery.error}
        >
            <>
                <DuplicationNoticeBox section={section} />
                <AttributeFormFields initialValues={duplicateData ?? {}} />
            </>
        </SectionedFormWrapper>
    )
}
