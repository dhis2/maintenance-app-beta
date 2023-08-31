import { useDataQuery } from '@dhis2/app-runtime'
import { SelectOption } from '../../../types'
import { FilteredCategoryCombo } from './types'

type InitialCategoryComboQueryResult = {
    categoryCombo: FilteredCategoryCombo
}

const INITIAL_OPTION_QUERY = {
    categoryCombo: {
        resource: 'categoryCombos',
        id: (variables: Record<string, string>) => variables.id,
        params: {
            fields: ['id', 'name'],
        },
    },
}

export function useInitialOptionQuery({
    selected,
    onComplete,
}: {
    onComplete: (option: SelectOption) => void
    selected?: string
}) {
    return useDataQuery<InitialCategoryComboQueryResult>(INITIAL_OPTION_QUERY, {
        lazy: true,
        variables: { id: selected },
        onComplete: (data) => {
            const categoryCombo = data.categoryCombo
            const { id: value, name: label } = categoryCombo
            onComplete({ value, label })
        },
    })
}
