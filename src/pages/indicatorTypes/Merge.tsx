import { Card } from '@dhis2/ui'
import React from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { StandardFormSectionTitle } from '../../components'
import { LoadingSpinner } from '../../components/loading/LoadingSpinner'
import { useLocationWithState } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { ModelCollectionResponse } from '../../types/generated'
import { IndicatorTypeMergeForm } from './merge/IndicatorTypeMerge'

export const Component = () => {
    const location = useLocationWithState<{ selectedModels: Set<string> }>()
    const queryFn = useBoundResourceQueryFn()

    const initialSelected = location.state?.selectedModels
        ? Array.from(location.state.selectedModels)
        : []

    const q = useQuery({
        queryKey: [
            {
                resource: 'indicatorTypes',
                params: {
                    filter: `id:in:[${initialSelected.join()}]`,
                    fields: ['id', 'displayName'],
                    paging: false,
                },
            },
        ],
        queryFn: queryFn<
            ModelCollectionResponse<
                { id: string; displayName: string },
                'indicatorTypes'
            >
        >,
        enabled: initialSelected.length > 0,
        select: (data) => data.indicatorTypes,
    })

    return (
        <Card>
            <StandardFormSectionTitle>
                Configure indicator type merge
            </StandardFormSectionTitle>
            {q.isLoading && <LoadingSpinner />}
            {q.isSuccess && <IndicatorTypeMergeForm selectedModels={q.data} />}
        </Card>
    )
}
