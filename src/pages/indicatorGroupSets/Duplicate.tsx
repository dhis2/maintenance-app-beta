import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormBase } from '../../components'
import { DefaultDuplicateFormContents } from '../../components/form/DefaultFormContents'
import { DEFAULT_FIELD_FILTERS, SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters } from '../../types/generated'
import { IndicatorGroupSet } from '../../types/models'
import IndicatorGroupSetFormFields from './form/IndicatorGroupSetFormFields'
import { validate } from './form/indicatorGroupSetSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'compulsory',
    'indicatorGroups[id,displayName]',
] as const

export type IndicatorGroupSetFormValues = PickWithFieldFilters<
    IndicatorGroupSet,
    typeof fieldFilters
>

const section = SECTIONS_MAP.indicatorGroupSet

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'indicatorGroupSets',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const indicatorGroupSetQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<IndicatorGroupSetFormValues>,
    })

    const initialValues = useMemo(
        () => omit(indicatorGroupSetQuery.data, 'id'),
        [indicatorGroupSetQuery.data]
    )

    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            includeAttributes={false}
            fetchError={!!indicatorGroupSetQuery.error}
        >
            <DefaultDuplicateFormContents section={section}>
                <IndicatorGroupSetFormFields />
            </DefaultDuplicateFormContents>
        </FormBase>
    )
}
