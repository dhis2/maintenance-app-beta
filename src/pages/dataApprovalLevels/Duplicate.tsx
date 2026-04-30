import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormBase } from '../../components'
import { DefaultDuplicateFormContents } from '../../components/form/DefaultFormContents'
import { DEFAULT_FIELD_FILTERS, SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters } from '../../types/generated'
import { DataApprovalLevel } from '../../types/models'
import DataApprovalLevelFormFields from './form/DataApprovalLevelFormFields'
import { validate } from './form/dataApprovalLevelsSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'orgUnitLevel',
    'categoryOptionGroupSet[id,displayName]',
] as const

type DataApprovalLevelFormValues = PickWithFieldFilters<
    DataApprovalLevel,
    typeof fieldFilters
>

const section = SECTIONS_MAP.dataApprovalLevel

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'dataApprovalLevels',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const dataApprovalLevelQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<DataApprovalLevelFormValues>,
    })

    const initialValues = useMemo(
        () => omit(dataApprovalLevelQuery.data, 'id'),
        [dataApprovalLevelQuery.data]
    )

    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            fetchError={!!dataApprovalLevelQuery.error}
            includeAttributes={false}
        >
            <DefaultDuplicateFormContents section={section}>
                <DataApprovalLevelFormFields />
            </DefaultDuplicateFormContents>
        </FormBase>
    )
}
