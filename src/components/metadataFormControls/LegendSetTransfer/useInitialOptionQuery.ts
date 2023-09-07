import { useDataQuery } from '@dhis2/app-runtime'
import { useRef } from 'react'
import { SelectOption } from '../../../types'
import { FilteredLegendSet } from './types'

type InitialLegendSetQueryResult = {
    legendSets: FilteredLegendSet[]
}

export function useInitialOptionQuery({
    selected,
    onComplete,
}: {
    onComplete: (options: SelectOption[]) => void
    selected: string[]
}) {
    const initialSelected = useRef(selected)
    const query = {
        legendSets: {
            resource: 'legendSets',
            id: (variables: Record<string, string>) => variables.id,
            params: {
                fields: ['id', 'displayName'],
                filter: `id:in:[${initialSelected.current.join(',')}]`,
            },
        },
    }

    return useDataQuery<InitialLegendSetQueryResult>(query, {
        lazy: !initialSelected.current,
        variables: { id: selected },
        onComplete: (data) => {
            const { legendSets } = data
            const options = legendSets.map(({ id, displayName }) => ({
                value: id,
                label: displayName,
            }))

            onComplete(options)
        },
    })
}
