import { useDataQuery } from '@dhis2/app-runtime'
import { useRef } from 'react'
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
            fields: ['id', 'displayName'],
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
    const initialSelected = useRef(selected)
    return useDataQuery<InitialCategoryComboQueryResult>(INITIAL_OPTION_QUERY, {
        lazy: !initialSelected.current,
        variables: { id: selected },
        onComplete: (data) => {
            const categoryCombo = data.categoryCombo
            const { id: value, displayName: label } = categoryCombo
            onComplete({ value, label })
        },
    })
}
