import { useDataQuery } from '@dhis2/app-runtime'
import { useRef } from 'react'
import { DEFAULT_CATEGORY_COMBO } from '../../../lib'
import { SelectOption } from '../../../types'
import { FilteredCategoryCombo } from './types'

type InitialCategoryComboQueryResult = {
    categoryCombo: FilteredCategoryCombo
}

const INITIAL_CATEGORY_COMBO_QUERY = {
    categoryCombo: {
        resource: 'categoryCombos',
        id: (variables: Record<string, string>) => variables.id,
        params: {
            fields: ['id', 'displayName'],
        },
    },
}

export function useInitialCategoryComboQuery({
    selected,
    onComplete,
}: {
    onComplete: (option: SelectOption) => void
    selected?: string
}) {
    const initialSelected = useRef(selected)
    return useDataQuery<InitialCategoryComboQueryResult>(
        INITIAL_CATEGORY_COMBO_QUERY,
        {
            lazy:
                !initialSelected.current ||
                initialSelected.current === DEFAULT_CATEGORY_COMBO.id,
            variables: { id: selected },
            onComplete: (data) => {
                const categoryCombo = data.categoryCombo
                const { id: value, displayName: label } = categoryCombo
                onComplete({ value, label })
            },
        }
    )
}
