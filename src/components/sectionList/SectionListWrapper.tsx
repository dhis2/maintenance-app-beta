import React, { useMemo, useState } from 'react'
import { GistPaginator } from '../../lib/models/useModelGist'
import { IdentifiableObject, GistCollectionResponse } from '../../types/models'
import { FilterWrapper } from './filters/FilterWrapper'
import { SectionList } from './SectionList'
import { SectionListEmpty } from './SectionListEmpty'
import { SectionListLoader } from './SectionListLoader'
import { SectionListPagination } from './SectionListPagination'
import { SectionListRow } from './SectionListRow'
import { SelectionListHeader } from './SelectionListHeaderNormal'
import { SelectedColumns } from './types'

type SectionListWrapperProps<Model extends IdentifiableObject> = {
    availableColumns?: SelectedColumns<Model>
    defaultColumns: SelectedColumns<Model>
    data?: GistCollectionResponse<Model>
    filterElement?: React.ReactElement
    pagination: GistPaginator
}
export const SectionListWrapper = <Model extends IdentifiableObject>({
    availableColumns,
    defaultColumns,
    data,
    filterElement,
    pagination,
}: SectionListWrapperProps<Model>) => {
    const [selectedColumns, setSelectedColumns] =
        useState<SelectedColumns<Model>>(defaultColumns)
    const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set())

    const handleSelect = (id: string, checked: boolean) => {
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
        <div>
            <FilterWrapper>{filterElement}</FilterWrapper>
            <SelectionListHeader />
            <SectionList
                headerColumns={selectedColumns}
                onSelectAll={handleSelectAll}
                allSelected={allSelected}
            >
                {!data?.result ? (
                    <SectionListLoader />
                ) : data.result.length < 1 ? (
                    <SectionListEmpty />
                ) : (
                    data?.result.map((model) => (
                        <SectionListRow
                            key={model.id}
                            modelData={model}
                            selectedColumns={selectedColumns}
                            onSelect={handleSelect}
                            selected={selectedModels.has(model.id)}
                        />
                    ))
                )}
                <SectionListPagination pagination={pagination} />
            </SectionList>
        </div>
    )
}
