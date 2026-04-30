import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { FormBase } from '../../components'
import { DefaultDuplicateFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { AnalyticsTableHookFormFields } from './form/AnalyticsTableHookFormFields'
import {
    AnalyticsTableHookFormValues,
    validate,
} from './form/analyticsTableHookSchema'
import { fieldFilters } from './form/fieldFilters'

const section = SECTIONS_MAP.analyticsTableHook

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'analyticsTableHooks',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const analyticsTableHookQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<AnalyticsTableHookFormValues>,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={omit(analyticsTableHookQuery.data, 'id')}
            validate={validate}
            fetchError={!!analyticsTableHookQuery.error}
            includeAttributes={false}
        >
            <DefaultDuplicateFormContents section={section}>
                <AnalyticsTableHookFormFields />
            </DefaultDuplicateFormContents>
        </FormBase>
    )
}
