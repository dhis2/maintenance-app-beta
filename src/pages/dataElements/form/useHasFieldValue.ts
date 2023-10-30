import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useMemo } from 'react'
import { Pager } from '../../../types/generated'

const HAS_FIELD_VALUE_QUERY = {
    dataElements: {
        resource: 'dataElements',
        params: (variables: Record<string, string>) => ({
            pageSize: 1,
            fields: '',
            filter: [`${variables.field}:eq:${variables.value}`],
        }),
    },
}

interface QueryResponse {
    dataElements: {
        pager: Pager
    }
}

export function useHasFieldValue(field: string) {
    const queryResult = useDataQuery<QueryResponse>(HAS_FIELD_VALUE_QUERY, {
        lazy: true,
    })

    return useMemo(
        () => ({
            ...queryResult,
            refetch: (value: string) => {
                if (!value) {
                    return
                }

                return queryResult.refetch({ field, value }).then(
                    // We don't have access to app-runtime's internal type `JsonMap`,
                    // so we have to ignore the type error
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    (data: QueryResponse) =>
                        data.dataElements.pager.total
                            ? i18n.t(
                                  'This {{field}} already exists, please choose antoher one',
                                  { field }
                              )
                            : undefined
                )
            },
        }),
        [field, queryResult]
    )
}
