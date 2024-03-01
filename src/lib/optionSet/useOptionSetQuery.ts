import { useDataQuery } from '@dhis2/app-runtime'
import { OptionSet } from '../../types/generated'

type OptionSetQueryResult = {
    optionSets: OptionSet
}

const CATEGORY_COMBOS_QUERY = {
    optionSets: {
        resource: 'optionSets',
        id: (variables: Record<string, string>) => {
            if (!variables.id) {
                throw new Error(
                    'Variable "id" required for `useOptionSetQuery`'
                )
            }

            return variables.id
        },
        params: (variables: Record<string, string>) => {
            const fields = variables.fields?.length > 0 ? variables.fields : '*'

            return { ...variables, fields }
        },
    },
}

export function useOptionSetQuery<QueryResult = OptionSetQueryResult>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryOptions: Record<string, any>
) {
    return useDataQuery<QueryResult>(CATEGORY_COMBOS_QUERY, queryOptions)
}
