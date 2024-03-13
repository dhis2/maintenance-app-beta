import { FetchError } from '@dhis2/app-runtime'
import { SharingDialog } from '@dhis2/ui'
import React, { useMemo, useState } from 'react'
import { BaseListModel, useSchemaFromHandle } from '../../lib'
import { Pager, ModelCollection } from '../../types/models'
import { SectionListHeaderBulk } from './bulk'
import { DetailsPanel, DefaultDetailsPanelContent } from './detailsPanel'
import { FilterWrapper } from './filters/FilterWrapper'
import { DefaultListActions } from './listActions'
import { useModelListView } from './listView'
import { ModelValue } from './modelValue/ModelValue'
import { SectionList } from './SectionList'
import css from './SectionList.module.css'
import { SectionListHeader } from './SectionListHeaderNormal'
import { SectionListLoader } from './SectionListLoader'
import { SectionListEmpty, SectionListError } from './SectionListMessages'
import { SectionListPagination } from './SectionListPagination'
import { SectionListRow } from './SectionListRow'
import { SectionListTitle } from './SectionListTitle'

type SectionListWrapperProps = {
    data: ModelCollection<BaseListModel> | undefined
    pager: Pager | undefined
    error: FetchError | undefined
}

export const SectionListWrapper = ({
    data,
    error,
    pager,
}: SectionListWrapperProps) => {
    const { columns: headerColumns } = useModelListView()
    const schema = useSchemaFromHandle()
    const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set())
    const [detailsId, setDetailsId] = useState<string | undefined>()
    const [sharingDialogId, setSharingDialogId] = useState<string | undefined>()

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
                    data?.map((model) => {
                        return model.id
                    })
                )
            )
        } else {
            setSelectedModels(new Set())
        }
    }

    const handleShowDetails = (id: string) =>
        setDetailsId((prevDetailsId) => (prevDetailsId === id ? undefined : id))

    const allSelected = useMemo(() => {
        return data?.length !== 0 && data?.length === selectedModels.size
    }, [data, selectedModels.size])

    const SectionListMessage = () => {
        if (error) {
            console.log(error.details || error)
            return <SectionListError />
        }
        if (!data) {
            return <SectionListLoader />
        }
        if (data.length < 1) {
            return <SectionListEmpty />
        }
        return null
    }

    return (
        <div>
            <SectionListTitle />
            <FilterWrapper />
            <div className={css.listDetailsWrapper}>
                {selectedModels.size > 0 ? (
                    <SectionListHeaderBulk
                        selectedModels={selectedModels}
                        onDeselectAll={() => setSelectedModels(new Set())}
                    />
                ) : (
                    <SectionListHeader />
                )}
                <SectionList
                    headerColumns={headerColumns}
                    onSelectAll={handleSelectAll}
                    allSelected={allSelected}
                >
                    <SectionListMessage />
                    {data?.map((model) => (
                        <SectionListRow
                            key={model.id}
                            modelData={model}
                            selectedColumns={headerColumns}
                            onSelect={handleSelect}
                            onClick={({ id }) => {
                                setDetailsId((prevDetailsId) =>
                                    prevDetailsId === id ? undefined : id
                                )
                            }}
                            selected={selectedModels.has(model.id)}
                            active={model.id === detailsId}
                            renderColumnValue={({ path }) => {
                                return (
                                    <ModelValue
                                        path={path}
                                        schema={schema}
                                        sectionModel={model}
                                    />
                                )
                            }}
                            renderActions={() => (
                                <DefaultListActions
                                    model={model}
                                    onShowDetailsClick={handleShowDetails}
                                    onOpenSharingClick={setSharingDialogId}
                                />
                            )}
                        />
                    ))}

                    <SectionListPagination pager={pager} />
                </SectionList>
                {detailsId && (
                    <DetailsPanel
                        onClose={() => setDetailsId(undefined)}
                        // reset component state when modelId changes
                        key={detailsId}
                    >
                        <DefaultDetailsPanelContent modelId={detailsId} />
                    </DetailsPanel>
                )}
            </div>
            {sharingDialogId && (
                <SharingDialog
                    id={sharingDialogId}
                    /* @TODO: Sharing dialog does not support metadata
                    but it works if you pass the correct type*/
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    type={schema.singular as any}
                    onClose={() => setSharingDialogId(undefined)}
                />
            )}
        </div>
    )
}
