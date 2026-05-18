import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormBase } from '../../components'
import { DefaultDuplicateFormContents } from '../../components/form/DefaultFormContents'
import {
    ATTRIBUTE_VALUES_FIELD_FILTERS,
    DEFAULT_FIELD_FILTERS,
    SECTIONS_MAP,
    useOnSubmitNew,
} from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { SqlView, PickWithFieldFilters } from '../../types/generated'
import { SqlViewFormFields, validate } from './form'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    ...ATTRIBUTE_VALUES_FIELD_FILTERS,
    'name',
    'description',
    'type',
    'cacheStrategy',
    'sqlQuery',
] as const

export type SqlViewFormValues = PickWithFieldFilters<
    SqlView,
    typeof fieldFilters
>

const section = SECTIONS_MAP.sqlView

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('clonedId') as string

    const query = {
        resource: 'sqlViews',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const sqlViewQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<SqlViewFormValues>,
    })

    const onSubmit = useOnSubmitNew<Omit<SqlViewFormValues, 'id'>>({
        section,
    })

    const initialValues = useMemo(() => {
        return sqlViewQuery.data ? omit(sqlViewQuery.data, 'id') : undefined
    }, [sqlViewQuery.data])

    return (
        <FormBase
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={validate}
            fetchError={!!sqlViewQuery.error}
        >
            <DefaultDuplicateFormContents section={section}>
                <SqlViewFormFields />
            </DefaultDuplicateFormContents>
        </FormBase>
    )
}
