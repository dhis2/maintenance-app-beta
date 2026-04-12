import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { DefaultEditFormContents, FormBase } from '../../components'
import { SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { AnalyticsTableHookFormFields } from './form/AnalyticsTableHookFormFields'
import {
    AnalyticsTableHookFormValues,
    validate,
} from './form/analyticsTableHookSchema'
import { fieldFilters } from './form/fieldFilters'

export const Component = () => {
    const modelId = useParams().id as string
    const section = SECTIONS_MAP.analyticsTableHook
    const queryFn = useBoundResourceQueryFn()

    const query = {
        resource: 'analyticsTableHooks',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }

    const analyticsTableHookQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<AnalyticsTableHookFormValues>,
    })
    const initialValues = analyticsTableHookQuery.data

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={initialValues}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultEditFormContents section={section}>
                <AnalyticsTableHookFormFields />
            </DefaultEditFormContents>
        </FormBase>
    )
}
