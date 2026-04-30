import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
    SECTIONS_MAP,
    useOnSubmitEdit,
} from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters, SqlView } from '../../types/generated'
import { SqlViewFormFields, validate } from './form'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'description',
    'cacheStrategy',
    'type',
    'sqlQuery',
] as const

export type SqlViewFormValues = PickWithFieldFilters<
    SqlView,
    typeof fieldFilters
> & { id: string }

const section = SECTIONS_MAP.sqlView

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string

    const query = {
        resource: 'sqlViews',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const sqlViewQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<SqlViewFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={sqlViewQuery.data}
            validate={validate}
        >
            <DefaultEditFormContents section={section}>
                <SqlViewFormFields mode="edit" />
            </DefaultEditFormContents>
        </FormBase>
    )
}
