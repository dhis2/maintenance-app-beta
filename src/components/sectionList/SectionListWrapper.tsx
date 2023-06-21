import React, { useMemo, useState } from 'react'
import {
    IdentifiableObject,
    GistModel,
    GistCollectionResponse,
} from '../../types/models'
import { SectionList } from './SectionList'
import { SectionListRow } from './SectionListRow'
import { SelectedColumns } from './types'

type SectionListWrapperProps<Model extends IdentifiableObject> = {
    availableColumns?: SelectedColumns<Model>
    defaultColumns: SelectedColumns<Model>
    data?: GistCollectionResponse<Model>
}
export const SectionListWrapper = <Model extends IdentifiableObject>({
    availableColumns,
    defaultColumns,
    data,
}: SectionListWrapperProps<Model>) => {
    const [selectedColumns, setSelectedColumns] =
        useState<SelectedColumns<Model>>(defaultColumns)
    const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set())
    console.log({ selectedModels })
    const handleSelect = (id: string, checked: boolean) => {
        console.log('select', id, checked)
        if (checked) {
            setSelectedModels(new Set(selectedModels).add(id))
        } else {
            selectedModels.delete(id)
            setSelectedModels(new Set(selectedModels))
        }
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedModels(
                new Set(
                    data?.result?.map((model) => {
                        return model.id
                    })
                )
            )
        } else {
            setSelectedModels(new Set())
        }
    }

    const allSelected = useMemo(() => {
        return (
            data?.result.length !== 0 &&
            data?.result.length === selectedModels.size
        )
    }, [data?.result, selectedModels.size])

    return (
        <SectionList
            headerColumns={selectedColumns}
            onSelectAll={handleSelectAll}
            allSelected={allSelected}
        >
            {!data?.result
                ? 'Loading...'
                : data?.result.map((model) => (
                      <SectionListRow
                          key={model.id}
                          modelData={model}
                          selectedColumns={selectedColumns}
                          onSelect={handleSelect}
                          selected={selectedModels.has(model.id)}
                      />
                  ))}
        </SectionList>
    )
}
