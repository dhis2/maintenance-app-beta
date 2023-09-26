import { useDataQuery } from '@dhis2/app-runtime'
import { useRef } from 'react'
import { SelectOption } from '../../../types'
import { FilteredOptionSet } from './types'

type InitialOptionSetQueryResult = {
    optionSet: FilteredOptionSet
}

const INITIAL_OPTION_QUERY = {
    optionSet: {
        resource: 'optionSets',
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
    return useDataQuery<InitialOptionSetQueryResult>(INITIAL_OPTION_QUERY, {
        lazy: !initialSelected.current,
        variables: { id: selected },
        onComplete: (data) => {
            const optionSet = data.optionSet
            const { id: value, displayName: label } = optionSet
            onComplete({ value, label })
        },
    })
}
