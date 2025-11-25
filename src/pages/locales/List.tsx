import { FetchError, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Input, InputEventPayload } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    DefaultSectionListMessage,
    SectionList,
    SectionListRow,
    SelectedColumn,
} from '../../components'
import { ClientDateTime } from '../../components/date'
import {
    DetailItem,
    DetailsList,
    DetailsPanel,
    DetailsPanelContent,
} from '../../components/sectionList/detailsPanel'
import { useModelListView } from '../../components/sectionList/listView'
import { ModelValueRenderer } from '../../components/sectionList/modelValue/ModelValueRenderer'
import { SectionListTitle } from '../../components/sectionList/SectionListTitle'
import { Toolbar } from '../../components/sectionList/toolbar'
import { useSelectedModels } from '../../components/sectionList/useSelectedModels'
import {
    BaseListModel,
    getIn,
    SchemaFieldPropertyType,
    useNonSchemaSectionHandleOrThrow,
} from '../../lib'
import { ModelCollection, PagedResponse, WrapQueryResponse } from '../../types'
import css from './LocaleList.module.css'
import { LocaleListActions } from './LocaleListActions'

export type LocaleModel = BaseListModel & {
    lastUpdated?: string
    created?: string
}

type ModelListResponse = WrapQueryResponse<PagedResponse<LocaleModel, string>>

export const Component = () => {
    const model = useNonSchemaSectionHandleOrThrow()
    const { columns: headerColumns } = useModelListView()

    const engine = useDataEngine()
    const modelListName = model.namePlural
    const query = {
        result: {
            resource: modelListName,
        },
    }
    const { error, data, refetch } = useQuery({
        queryKey: [query],
        queryFn: ({ queryKey: [query], signal }) => {
            return engine.query(query, { signal }) as Promise<ModelListResponse>
        },
    })

    const localesList = useMemo(
        () =>
            Array.isArray(data?.result)
                ? data?.result.map((item: LocaleModel) => ({
                      ...item,
                      access: {
                          read: true,
                          write: true,
                          update: false,
                          delete: true,
                          externalize: false,
                          manage: false,
                      },
                  }))
                : undefined,
        [data?.result]
    )

    const [filteredData, setFilteredData] = useState<
        ModelCollection<LocaleModel> | undefined
    >(localesList)
    const [filter, setFilter] = useState('')
    const handleSetFilter = (event: InputEventPayload) => {
        const eventValue = event.value ?? ''
        setFilter(eventValue)
    }
    useEffect(() => {
        setFilteredData(
            localesList?.filter(
                (d) =>
                    d.displayName
                        .toLowerCase()
                        .includes(filter.toLowerCase()) ||
                    d.id.toLowerCase().includes(filter.toLowerCase())
            )
        )
    }, [filter, localesList])

    const { selectedModels, checkAllSelected, add, remove, toggle, clearAll } =
        useSelectedModels()

    const handleSelectAll = useCallback(
        (checked: boolean) => {
            if (!localesList) {
                return
            }
            if (checked) {
                add(localesList.map((model) => model.id))
            } else {
                remove(
                    localesList
                        .filter((model) => model.id)
                        .map((model) => model.id)
                )
            }
        },
        [localesList, add, remove]
    )

    const isAllSelected = localesList ? checkAllSelected(localesList) : false

    const [detailsRow, setDetailsRow] = useState<LocaleModel | undefined>()

    const handleDetailsClick = useCallback(
        (row: LocaleModel) => {
            setDetailsRow((prevDetailsRow) =>
                prevDetailsRow?.id === row?.id ? undefined : row
            )
        },
        [setDetailsRow]
    )

    /* Note that SectionListRow is memoed, to prevent re-rendering
every item when interacting with a row */
    const renderColumnValue: (
        { path }: SelectedColumn,
        model: BaseListModel
    ) => React.JSX.Element = useCallback(
        ({ path }: SelectedColumn, model: BaseListModel) => {
            return (
                <ModelValueRenderer
                    path={path}
                    value={getIn(model, path)?.toString()}
                    propertyType={
                        path === 'lastUpdated' || path === 'created'
                            ? ('DATE' as SchemaFieldPropertyType)
                            : ('TEXT' as SchemaFieldPropertyType)
                    }
                />
            )
        },
        []
    )

    return (
        <div>
            <SectionListTitle />
            <div className={css.filterWrapper}>
                <Input
                    className={css.identifiableSelectionFilter}
                    placeholder={i18n.t('Search by name, code or ID')}
                    onChange={handleSetFilter}
                    value={filter}
                    dataTest="input-search-name"
                    dense
                />
                <Button
                    small
                    onClick={() => setFilter('')}
                    dataTest="clear-all-filters-button"
                >
                    {i18n.t('Clear all filters')}
                </Button>
            </div>
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
                    <DefaultSectionListMessage
                        error={error as FetchError | undefined}
                        data={filteredData}
                    />
                    {filteredData?.map((model) => (
                        <SectionListRow
                            key={model.id}
                            modelData={model}
                            selectedColumns={headerColumns}
                            onSelect={toggle}
                            onClick={handleDetailsClick}
                            selected={selectedModels.has(model.id)}
                            active={model.id === detailsRow?.id}
                            renderColumnValue={renderColumnValue}
                            renderActions={() => (
                                <LocaleListActions
                                    model={model}
                                    onShowDetailsClick={handleDetailsClick}
                                    onDeleteSuccess={(model: LocaleModel) => {
                                        remove(model.id)
                                        refetch()
                                    }}
                                />
                            )}
                        />
                    ))}
                </SectionList>
                {detailsRow && (
                    <DetailsPanel
                        onClose={() => setDetailsRow(undefined)}
                        key={detailsRow.id}
                    >
                        <DetailsPanelContent
                            displayName={detailsRow.displayName}
                        >
                            <DetailsList>
                                <DetailItem label={i18n.t('Created')}>
                                    <ClientDateTime
                                        value={detailsRow?.created}
                                    />
                                </DetailItem>
                                <DetailItem label={i18n.t('Last updated')}>
                                    <ClientDateTime
                                        value={detailsRow?.lastUpdated}
                                    />
                                </DetailItem>
                                <DetailItem label={i18n.t('Id')}>
                                    {detailsRow.id}
                                </DetailItem>
                            </DetailsList>
                        </DetailsPanelContent>
                    </DetailsPanel>
                )}
            </div>
        </div>
    )
}
