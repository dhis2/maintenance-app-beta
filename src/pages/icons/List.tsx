import { FetchError, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Input } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useState } from 'react'
import { ClientDateTime } from '../../components/date'
import {
    DetailItem,
    DetailsList,
    DetailsPanel,
    DetailsPanelContent,
} from '../../components/sectionList/detailsPanel'
import { useModelListView } from '../../components/sectionList/listView'
import { ModelValueRenderer } from '../../components/sectionList/modelValue/ModelValueRenderer'
import { TextValue } from '../../components/sectionList/modelValue/TextValue'
import { SectionList } from '../../components/sectionList/SectionList'
import { SectionListPagination } from '../../components/sectionList/SectionListPagination'
import { DefaultSectionListMessage } from '../../components/sectionList/SectionListWrapper'
import { DefaultToolbar } from '../../components/sectionList/toolbar'
import { SelectedColumn } from '../../components/sectionList/types'
import {
    getIn,
    SchemaFieldPropertyType,
    useDebouncedState,
    usePaginationQueryParams,
} from '../../lib'
import { ModelCollection, PagedResponse, WrapQueryResponse } from '../../types'
import css from './IconList.module.css'
import { IconListActions } from './IconListActions'
import { IconListRow } from './IconListRow'

export type IconModel = {
    key: string
    description: string
    href: string
    custom: boolean
    keywords?: string[]
    lastUpdated?: string
    created?: string
    createdBy?: { displayName: string; id: string }
}

type IconsListResponse = WrapQueryResponse<PagedResponse<IconModel, 'icons'>>

export const Component = () => {
    const { columns: headerColumns } = useModelListView()
    const engine = useDataEngine()
    const [paginationParams] = usePaginationQueryParams()
    const {
        liveValue: searchValue,
        setValue: setSearchValue,
        debouncedValue: debouncedSearch,
    } = useDebouncedState({ initialValue: '' })

    const query = {
        result: {
            resource: 'icons',
            params: {
                page: paginationParams.page,
                pageSize: paginationParams.pageSize,
                ...(debouncedSearch.trim()
                    ? { search: debouncedSearch.trim() }
                    : {}),
            },
        },
    }

    const { data, error, refetch } = useQuery({
        queryKey: [query],
        queryFn: ({ queryKey: [query], signal }) =>
            engine.query(query, { signal }) as Promise<IconsListResponse>,
    })

    const iconList = data?.result?.icons
    const pager = data?.result?.pager

    const [detailsIcon, setDetailsIcon] = useState<IconModel | undefined>()

    const handleDetailsClick = useCallback((icon: IconModel) => {
        setDetailsIcon((prev) => (prev?.key === icon.key ? undefined : icon))
    }, [])

    const renderColumnValue = useCallback(
        ({ path }: SelectedColumn, icon: IconModel) => {
            if (path === 'href') {
                return icon.href ? (
                    <img
                        src={icon.href}
                        alt={icon.key}
                        className={css.iconThumbnail}
                    />
                ) : null
            }

            const value = getIn(icon, path)

            if (path === 'keywords' && Array.isArray(value)) {
                return <TextValue value={(value as string[]).join(', ')} />
            }

            if (value === undefined || value === null) {
                return null
            }

            const propertyType: SchemaFieldPropertyType =
                path === 'lastUpdated' || path === 'created'
                    ? SchemaFieldPropertyType.DATE
                    : path === 'custom'
                    ? SchemaFieldPropertyType.BOOLEAN
                    : SchemaFieldPropertyType.TEXT

            return (
                <ModelValueRenderer
                    path={path}
                    value={value}
                    propertyType={propertyType}
                />
            )
        },
        []
    )

    return (
        <div>
            <div className={css.filterWrapper}>
                <Input
                    dense
                    className={css.filterInput}
                    placeholder={i18n.t(
                        'Search by name, keyword or description'
                    )}
                    value={searchValue}
                    onChange={({ value }) => setSearchValue(value || '')}
                    type="search"
                    dataTest="input-search-name"
                />
                <Button
                    small
                    onClick={() => setSearchValue('')}
                    dataTest="clear-all-filters-button"
                >
                    {i18n.t('Clear filter')}
                </Button>
            </div>
            <div className={css.listDetailsWrapper}>
                <DefaultToolbar
                    selectedModels={new Set()}
                    onDeselectAll={() => {}}
                    downloadable={false}
                />
                <SectionList headerColumns={headerColumns}>
                    <DefaultSectionListMessage
                        error={error as FetchError | undefined}
                        data={iconList as unknown as ModelCollection}
                    />
                    {iconList?.map((icon) => (
                        <IconListRow
                            key={icon.key}
                            modelData={icon}
                            selectedColumns={headerColumns}
                            onClick={handleDetailsClick}
                            active={icon.key === detailsIcon?.key}
                            renderColumnValue={renderColumnValue}
                            renderActions={() => (
                                <IconListActions
                                    model={icon}
                                    onShowDetailsClick={handleDetailsClick}
                                    onDeleteSuccess={() => {
                                        if (detailsIcon?.key === icon.key) {
                                            setDetailsIcon(undefined)
                                        }
                                        refetch()
                                    }}
                                />
                            )}
                        />
                    ))}
                    <SectionListPagination pager={pager} />
                </SectionList>
                {detailsIcon && (
                    <DetailsPanel
                        onClose={() => setDetailsIcon(undefined)}
                        key={detailsIcon.key}
                    >
                        <DetailsPanelContent displayName={detailsIcon.key}>
                            {detailsIcon.href && (
                                <img
                                    src={detailsIcon.href}
                                    alt={detailsIcon.key}
                                    className={css.iconDetailsThumbnail}
                                />
                            )}
                            <DetailsList>
                                {detailsIcon.description && (
                                    <DetailItem label={i18n.t('Description')}>
                                        {detailsIcon.description}
                                    </DetailItem>
                                )}
                                <DetailItem label={i18n.t('Custom')}>
                                    {detailsIcon.custom
                                        ? i18n.t('Yes')
                                        : i18n.t('No')}
                                </DetailItem>
                                {!!detailsIcon.keywords?.length && (
                                    <DetailItem label={i18n.t('Keywords')}>
                                        {detailsIcon.keywords.join(', ')}
                                    </DetailItem>
                                )}
                                {detailsIcon.lastUpdated && (
                                    <DetailItem label={i18n.t('Last updated')}>
                                        <ClientDateTime
                                            value={detailsIcon.lastUpdated}
                                        />
                                    </DetailItem>
                                )}
                                {detailsIcon.created && (
                                    <DetailItem label={i18n.t('Created')}>
                                        <ClientDateTime
                                            value={detailsIcon.created}
                                        />
                                    </DetailItem>
                                )}
                                {detailsIcon.createdBy && (
                                    <DetailItem label={i18n.t('Created by')}>
                                        {detailsIcon.createdBy.displayName}
                                    </DetailItem>
                                )}
                            </DetailsList>
                        </DetailsPanelContent>
                    </DetailsPanel>
                )}
            </div>
        </div>
    )
}
