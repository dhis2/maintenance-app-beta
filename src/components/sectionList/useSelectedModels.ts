// export interface useSelecto
import { memoize } from 'lodash'
import { useState, useMemo, useCallback } from 'react'
import { BaseListModel, canEditModel } from '../../lib'

export type UseSelectedModelsOptions = { intialSelected?: string[] }

export function useSelectedModels(options?: UseSelectedModelsOptions) {
    const [selectedModels, setSelectedModels] = useState<Set<string>>(
        () => new Set(options?.intialSelected || [])
    )

    const add = useCallback(
        (ids: string | string[]) => {
            const addIds = Array.isArray(ids) ? ids : [ids]
            setSelectedModels((prevSelected) => {
                const newSelected = new Set(prevSelected)
                addIds.forEach((id) => newSelected.add(id))
                return newSelected
            })
        },
        [setSelectedModels]
    )

    const remove = useCallback(
        (ids: string | string[]) => {
            const removeIds = Array.isArray(ids) ? ids : [ids]

            setSelectedModels((prevSelected) => {
                const newSelected = new Set(prevSelected)
                removeIds.forEach((id) => newSelected.delete(id))
                return newSelected
            })
        },
        [setSelectedModels]
    )
    const toggle = useCallback(
        (ids: string | string[], checked: boolean) => {
            if (checked) {
                add(ids)
            } else {
                remove(ids)
            }
        },
        [add, remove]
    )

    const clearAll = useCallback(
        () => setSelectedModels(new Set()),
        [setSelectedModels]
    )

    const checkAllSelected = useMemo(
        () =>
            memoize((data: BaseListModel[]) => {
                if (!data) {
                    return false
                }
                return data
                    .filter((m) => canEditModel(m))
                    .every((model) => selectedModels.has(model.id))
            }),
        [selectedModels]
    )

    return {
        selectedModels,
        checkAllSelected,
        add,
        remove,
        toggle,
        clearAll,
    }
}
