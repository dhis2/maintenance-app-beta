import { useDataQuery } from '@dhis2/app-runtime'
import { useRef } from 'react'
import { SelectOption } from '../../../types'
import { FilteredDataElement } from './types'

type InitialDataElementsQueryResult = {
    dataElements: {
        dataElements: FilteredDataElement[]
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
        dataElements: {
            resource: 'dataElements',
            params: {
                paging: false,
                fields: ['id', 'displayName'],
                filter: `id:in:[${initialSelected.current.join(',')}]`,
            },
        },
    }

    return useDataQuery<InitialDataElementsQueryResult>(query, {
        lazy: !initialSelected.current,
        variables: { id: selected },
        onComplete: (data) => {
            const { dataElements } = data.dataElements
            const options = dataElements.map(({ id, displayName }) => ({
                value: id,
                label: displayName,
            }))

            onComplete(options)
        },
    })
}
