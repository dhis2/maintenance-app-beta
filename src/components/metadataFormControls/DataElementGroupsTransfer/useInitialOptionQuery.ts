import { useDataQuery } from '@dhis2/app-runtime'
import { useRef } from 'react'
import { SelectOption } from '../../../types'
import { FilteredDataElementGroup } from './types'

type InitialDataElementGroupsQueryResult = {
    dataElementGroups: {
        dataElementGroups: FilteredDataElementGroup[]
    }
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
        dataElementGroups: {
            resource: 'dataElementGroups',
            params: {
                paging: false,
                fields: ['id', 'displayName'],
                filter: `id:in:[${initialSelected.current.join(',')}]`,
            },
        },
    }

    return useDataQuery<InitialDataElementGroupsQueryResult>(query, {
        lazy: !initialSelected.current,
        variables: { id: selected },
        onComplete: (data) => {
            const { dataElementGroups } = data.dataElementGroups
            const options = dataElementGroups.map(({ id, displayName }) => ({
                value: id,
                label: displayName,
            }))

            onComplete(options)
        },
    })
}
