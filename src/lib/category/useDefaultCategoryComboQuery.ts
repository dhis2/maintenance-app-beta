import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { CategoryCombo } from '../../types/generated'

type DefaultCategoryComboQueryResult = {
    categoryCombos: {
        categoryCombos: CategoryCombo[]
    }
}

const DEFAULT_CATEGORY_OPTION_QUERY = {
    categoryCombos: {
        resource: 'categoryCombos',
        params: (variables: Record<string, string>) => {
            const fields = ['id']
            if (variables.fields) {
                fields.push(...variables.fields)
            }

            return {
                fields,
                paging: false,
                filter: ['isDefault:eq:true'],
            }
        },
    },
}

export function useDefaultCategoryComboQuery({
    fields,
}: { fields?: string[] } = {}) {
    const variables = { fields }
    // The gist doesn't include the `isDefault` value, need to use `useDataQuery`
    const queryResult = useDataQuery<DefaultCategoryComboQueryResult>(
        DEFAULT_CATEGORY_OPTION_QUERY,
        { variables }
    )

    return useMemo(
        () => ({
            ...queryResult,
            data: queryResult.data?.categoryCombos.categoryCombos[0],
        }),
        [queryResult]
    )
}
