import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormBase } from '../../components'
import { DefaultDuplicateFormContents } from '../../components/form/DefaultFormContents'
import { DEFAULT_FIELD_FILTERS, SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters } from '../../types/generated'
import { DataApprovalWorkflow } from '../../types/models'
import DataApprovalWorkflowFormFields from './form/DataApprovalWorkflowFormFields'
import { validate } from './form/dataApprovalWorkflowSchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'periodType',
    'categoryCombo[id,displayName]',
    'dataApprovalLevels[id,displayName]',
] as const

type DataApprovalWorkflowFormValues = PickWithFieldFilters<
    DataApprovalWorkflow,
    typeof fieldFilters
>

const section = SECTIONS_MAP.dataApprovalWorkflow

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'dataApprovalWorkflows',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const dataApprovalWorkflowQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<DataApprovalWorkflowFormValues>,
    })

    const initialValues = useMemo(
        () => omit(dataApprovalWorkflowQuery.data, 'id'),
        [dataApprovalWorkflowQuery.data]
    )

    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            fetchError={!!dataApprovalWorkflowQuery.error}
            includeAttributes={false}
        >
            <DefaultDuplicateFormContents section={section}>
                <DataApprovalWorkflowFormFields />
            </DefaultDuplicateFormContents>
        </FormBase>
    )
}
