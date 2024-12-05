import { FetchError } from '@dhis2/app-runtime'
import { SharingDialog } from '@dhis2/ui'
import React, { useCallback, useState } from 'react'
import { BaseListModel, canEditModel, useSchemaFromHandle } from '../../lib'
import { Pager, ModelCollection } from '../../types/models'
import { DetailsPanel, DefaultDetailsPanelContent } from './detailsPanel'
import { FilterWrapper } from './filters/FilterWrapper'
import { DefaultListActions } from './listActions'
import { useModelListView } from './listView'
import { ModelValue } from './modelValue/ModelValue'
import { SectionList } from './SectionList'
import css from './SectionList.module.css'
import { SectionListLoader } from './SectionListLoader'
import { SectionListEmpty, SectionListError } from './SectionListMessages'
import { SectionListPagination } from './SectionListPagination'
import { SectionListRow } from './SectionListRow'
import { SectionListTitle } from './SectionListTitle'
import { Toolbar } from './toolbar'
import { TranslationDialog } from './translation'
import { SelectedColumn } from './types'
import { useSelectedModels } from './useSelectedModels'

type SectionListWrapperProps = {
    data: ModelCollection<BaseListModel> | undefined
    pager: Pager | undefined
    error: FetchError | undefined
    refetch: () => void
}

export const SectionListWrapper = ({
    data,
    error,
    pager,
    refetch,
}: SectionListWrapperProps) => {
    const { columns: headerColumns } = useModelListView()
    const schema = useSchemaFromHandle()

    const { selectedModels, checkAllSelected, add, remove, toggle, clearAll } =
        useSelectedModels()
    const [detailsId, setDetailsId] = useState<string | undefined>()
    const [sharingDialogId, setSharingDialogId] = useState<string | undefined>()
    const [translationDialogModel, setTranslationDialogModel] = useState<
        BaseListModel | undefined
    >(undefined)

    const onSharingDialogClose = () => {
        setSharingDialogId(undefined)
        refetch()
    }

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

    const handleSelectAll = useCallback(
        (checked: boolean) => {
            if (!data) {
                return
            }
            if (checked) {
                const editableIds = data
                    .filter((model) => canEditModel(model))
                    .map((model) => model.id)
                add(editableIds)
            } else {
                remove(
                    data.filter((model) => model.id).map((model) => model.id)
                )
            }
        },
        [data, add, remove]
    )

    const handleDetailsClick = useCallback(
        ({ id }: BaseListModel) => {
            setDetailsId((prevDetailsId) =>
                prevDetailsId === id ? undefined : id
            )
        },
        [setDetailsId]
    )

    /* Note that SectionListRow is memoed, to prevent re-rendering
    every item when interacting with a row */
    const renderColumnValue = useCallback(
        ({ path }: SelectedColumn, model: BaseListModel) => {
            return (
                <ModelValue path={path} schema={schema} sectionModel={model} />
            )
        },
        [schema]
    )

    const renderActions = useCallback(
        (model: BaseListModel) => (
            <DefaultListActions
                model={model}
                onShowDetailsClick={handleDetailsClick}
                onOpenSharingClick={setSharingDialogId}
                onDeleteSuccess={refetch}
                onOpenTranslationClick={setTranslationDialogModel}
            />
        ),
        [handleDetailsClick, setSharingDialogId, refetch]
    )

    const isAllSelected = data ? checkAllSelected(data) : false

    return (
        <div>
            <SectionListTitle />
            <FilterWrapper />
            <div className={css.listDetailsWrapper}>
                <Toolbar
                    selectedModels={selectedModels}
                    onDeselectAll={clearAll}
                />
                <SectionList
                    headerColumns={headerColumns}
                    onSelectAll={handleSelectAll}
                    allSelected={isAllSelected}
                >
                    <SectionListMessage />
                    {data?.map((model) => (
                        <SectionListRow
                            key={model.id}
                            modelData={model}
                            selectedColumns={headerColumns}
                            onSelect={toggle}
                            onClick={handleDetailsClick}
                            selected={selectedModels.has(model.id)}
                            active={model.id === detailsId}
                            renderColumnValue={renderColumnValue}
                            renderActions={renderActions}
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
                    onClose={() => onSharingDialogClose()}
                />
            )}
            {translationDialogModel && (
                <TranslationDialog
                    model={translationDialogModel}
                    onClose={() => setTranslationDialogModel(undefined)}
                />
            )}
        </div>
    )
}
