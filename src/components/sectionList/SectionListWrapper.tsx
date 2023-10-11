import { FetchError } from '@dhis2/app-runtime'
import React, { useMemo, useState } from 'react'
import { useSchemaFromHandle } from '../../lib'
import { IdentifiableObject, GistCollectionResponse } from '../../types/models'
import { FilterWrapper } from './filters/FilterWrapper'
import { useModelListView } from './listView'
import { ModelValue } from './modelValue/ModelValue'
import { SectionList } from './SectionList'
import { SectionListLoader } from './SectionListLoader'
import { SectionListEmpty, SectionListError } from './SectionListMessages'
import { SectionListPagination } from './SectionListPagination'
import { SectionListRow } from './SectionListRow'
import { SectionListTitle } from './SectionListTitle'
import { SelectionListHeader } from './SelectionListHeaderNormal'

type SectionListWrapperProps<Model extends IdentifiableObject> = {
    filterElement?: React.ReactElement
    data: GistCollectionResponse<Model> | undefined
    error: FetchError | undefined
}

export const SectionListWrapper = <Model extends IdentifiableObject>({
    filterElement,
    data,
    error,
}: SectionListWrapperProps<Model>) => {
    const { columns: headerColumns } = useModelListView()
    const schema = useSchemaFromHandle()
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
            console.log(error.details || error)
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
            <SectionListTitle />
            <FilterWrapper>{filterElement}</FilterWrapper>
            <SelectionListHeader />
            <SectionList
                headerColumns={headerColumns}
                onSelectAll={handleSelectAll}
                allSelected={allSelected}
            >
                <SectionListMessage />
                {data?.result.map((model) => (
                    <SectionListRow
                        key={model.id}
                        modelData={model}
                        selectedColumns={headerColumns}
                        onSelect={handleSelect}
                        selected={selectedModels.has(model.id)}
                        renderColumnValue={({ path }) => {
                            return (
                                <ModelValue
                                    path={path}
                                    schema={schema}
                                    sectionModel={model}
                                />
                            )
                        }}
                    />
                ))}
                <SectionListPagination data={data} />
            </SectionList>
        </div>
    )
}
