import { useRef } from 'react'
import { useOptionSetQuery } from '../../../lib'
import { SelectOption } from '../../../types'
import { FilteredOptionSet } from './types'

type InitialOptionSetQueryResult = {
    optionSets: FilteredOptionSet
}

const fields = ['id', 'displayName']

export function useInitialOptionQuery({
    selected,
    onComplete,
}: {
    onComplete: (option: SelectOption) => void
    selected?: string
}) {
    const initialSelected = useRef(selected)
    return useOptionSetQuery<InitialOptionSetQueryResult>({
        lazy: !initialSelected.current,
        variables: { id: selected, fields },
        onComplete: (data: InitialOptionSetQueryResult) => {
            const optionSet = data.optionSets
            const { id: value, displayName: label } = optionSet
            onComplete({ value, label })
        },
    })
}
