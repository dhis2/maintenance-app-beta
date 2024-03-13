// export interface useSelecto
import { useState, useMemo, useCallback } from 'react'
import { BaseListModel, canEditModel } from '../../lib'

export function useSelectedModels({
    data,
    initialSelected,
}: {
    data: BaseListModel[] | undefined
    initialSelected?: string[]
}) {
    const [selectedModels, setSelectedModels] = useState<Set<string>>(
        () => new Set(initialSelected || [])
    )

    const selectModel = useCallback(
        (id: string, checked: boolean) => {
            if (checked) {
                setSelectedModels((prevSelected) => {
                    const newSelected = new Set(prevSelected)
                    newSelected.add(id)
                    return newSelected
                })
            } else {
                setSelectedModels((prevSelected) => {
                    const newSelected = new Set(prevSelected)
                    newSelected.delete(id)
                    return newSelected
                })
            }
        },
        [setSelectedModels]
    )

    const selectAll = useCallback(
        (checked: boolean) => {
            if (checked) {
                setSelectedModels((prev) => {
                    const prevSeleted = Array.from(prev)
                    const allEditable =
                        data?.flatMap((model) => {
                            return canEditModel(model) ? [model.id] : []
                        }) || []
                    return new Set([...prevSeleted, ...allEditable])
                })
            } else {
                setSelectedModels((prev) => {
                    // since data can be selected from multiple pages
                    // remove only selected models that are in the current data/page
                    // eg. keep selected models that are not in the current data
                    const newSelected = new Set(prev)
                    data?.forEach((m) =>
                        prev.has(m.id) ? newSelected.delete(m.id) : null
                    )
                    return new Set(newSelected)
                })
            }
        },
        [data, setSelectedModels]
    )

    const clearAll = useCallback(
        () => setSelectedModels(new Set()),
        [setSelectedModels]
    )

    const isAllSelected = useMemo(() => {
        if (!data) {
            return false
        }
        // do not include uneditable models when checking if all are selected
        return data
            .filter((m) => canEditModel(m))
            .every((model) => selectedModels.has(model.id))
    }, [data, selectedModels])

    return {
        selectedModels,
        isAllSelected,
        selectModel,
        selectAll,
        clearAll,
    }
}
