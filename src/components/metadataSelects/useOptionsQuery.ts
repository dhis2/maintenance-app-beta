import { useEffect, useMemo, useRef, useState } from 'react'
import { useModelGist } from '../../lib'
import { SelectOption } from '../../types'
import { CategoryComboQueryResult } from './types'

export function useOptionsQuery({
    initialSelected,
    setSelectedOption,
    fetchInitialOption,
}: {
    setSelectedOption: (option: SelectOption) => void
    fetchInitialOption: () => void
    initialSelected?: string
}) {
    const fetchedInitialOptionRef = useRef(false)
    const [loadedOptions, setLoadedOptions] = useState<SelectOption[]>([])
    const queryResult = useModelGist<CategoryComboQueryResult>(
        'categoryCombos/gist',
        // { pageSize: 10 },
        {},
        {
            variables: { pageSize: 10, filter: '' },
            onComplete: (input: unknown) => {
                if (initialSelected && !fetchedInitialOptionRef.current) {
                    fetchedInitialOptionRef.current = true

                    const nextData = input as {
                        result: CategoryComboQueryResult
                    }
                    const initiallySelectedOption =
                        nextData?.result.result.find(
                            (option) => option.id === initialSelected
                        )

                    if (initiallySelectedOption) {
                        setSelectedOption({
                            value: initialSelected as string,
                            label: initiallySelectedOption.name,
                        })
                    } else if (initialSelected) {
                        fetchInitialOption()
                    }
                }
            },
        }
    )
    const { data } = queryResult

    // Must be done in `useEffect` and not in `onComplete`, as `onComplete`
    // won't get called when useDataQuery has the values in cache already
    useEffect(() => {
        if (data) {
            const { pager, result } = data
            // We want to add new options to existing ones so we don't have to
            // refetch existing options
            setLoadedOptions((prevLoadedOptions) => [
                // We only want to add when the current page is > 1
                ...(pager.page === 1 ? [] : prevLoadedOptions),
                ...(result.map(({ id, name }) => ({
                    value: id,
                    label: name,
                })) || []),
            ])
        }
    }, [data])

    return useMemo(
        () => ({
            ...queryResult,
            data: {
                pager: queryResult.data?.pager,
                result: loadedOptions,
            },
        }),
        [loadedOptions, queryResult]
    )
}
