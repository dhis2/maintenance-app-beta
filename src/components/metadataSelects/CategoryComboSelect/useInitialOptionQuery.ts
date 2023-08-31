import { useDataQuery } from '@dhis2/app-runtime'
import { SelectOption } from '../../../types'
import { FilteredCategoryCombo } from './types'

type InitialCategoryComboQueryResult = {
    categoryCombo: FilteredCategoryCombo
}

export function useInitialOptionQuery({
    selected,
    onComplete,
}: {
    onComplete: (option: SelectOption) => void
    selected?: string
}) {
    const INITIAL_OPTION_QUERY = {
        categoryCombo: {
            resource: `categoryCombos/${selected}`,
            params: {
                fields: ['id', 'name'],
            },
        },
    }

    return useDataQuery<InitialCategoryComboQueryResult>(INITIAL_OPTION_QUERY, {
        lazy: true,
        onComplete: (data) => {
            const categoryCombo = data.categoryCombo
            const { id: value, name: label } = categoryCombo
            onComplete({ value, label })
        },
    })
}
