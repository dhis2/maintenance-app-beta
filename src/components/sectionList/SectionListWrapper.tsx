import { FetchError } from '@dhis2/app-runtime'
import React, { useMemo, useState } from 'react'
import { IdentifiableObject, GistCollectionResponse } from '../../types/models'
import { FilterWrapper } from './filters/FilterWrapper'
import { SectionList } from './SectionList'
import { SectionListLoader } from './SectionListLoader'
import { SectionListEmpty, SectionListError } from './SectionListMessage'
import { SectionListPagination } from './SectionListPagination'
import { SectionListRow } from './SectionListRow'
import { SelectionListHeader } from './SelectionListHeaderNormal'
import { SelectedColumns } from './types'

type SectionListWrapperProps<Model extends IdentifiableObject> = {
    availableColumns?: SelectedColumns<Model>
    defaultColumns: SelectedColumns<Model>
    filterElement?: React.ReactElement
    data: GistCollectionResponse<Model> | undefined
    error: FetchError | undefined
}
export const SectionListWrapper = <Model extends IdentifiableObject>({
    availableColumns,
    defaultColumns,
    filterElement,
    data,
    error,
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

    const SectionListMessage = () => {
        if (error) {
            console.log(error.details)
            return <SectionListError />
        }
        if (!data?.result) {
            return <SectionListLoader />
        }
        if (data?.result?.length < 1) {
            return <SectionListEmpty />
        }
        return null
    }

    return (
        <div>
            <FilterWrapper>{filterElement}</FilterWrapper>
            <SelectionListHeader />
            <SectionList
                headerColumns={selectedColumns}
                onSelectAll={handleSelectAll}
                allSelected={allSelected}
            >
                <SectionListMessage />
                {data?.result &&
                    data?.result.map((model) => (
                        <SectionListRow
                            key={model.id}
                            modelData={model}
                            selectedColumns={selectedColumns}
                            onSelect={handleSelect}
                            selected={selectedModels.has(model.id)}
                        />
                    ))}
                <SectionListPagination data={data} />
            </SectionList>
        </div>
    )
}
