import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import React, { useMemo, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { useHref } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import { getSectionNewPath } from '../../../lib'
import { useBoundResourceQueryFn } from '../../../lib/query/useBoundQueryFn'
import { PlainResourceQuery } from '../../../types'
import { IdentifiableObject, PagedResponse } from '../../../types/generated'
import { DisplayableModel } from '../../../types/models'
import { LinkButton } from '../../LinkButton'
import { BaseModelTransfer, BaseModelTransferProps } from './BaseModelTransfer'
import css from './ModelTransfer.module.css'

type Response<Model> = PagedResponse<Model, string>

const defaultQuery = {
    params: {
        order: 'displayName:asc',
        fields: ['id', 'displayName'],
    },
}

export type ModelTranferProps<
    TModel extends DisplayableModel,
    TModelData
> = Omit<BaseModelTransferProps<TModel>, 'available' | 'filterable'> & {
    query: Omit<PlainResourceQuery, 'id'>
    transform?: (value: TModelData[]) => TModel[]
}

export const ModelTransfer = <
    TModel extends DisplayableModel,
    TModelData extends DisplayableModel = TModel
>({
    selected,
    query,
    leftHeader,
    rightHeader,
    leftFooter,
    filterPlaceholder,
    filterPlaceholderPicked,
    transform,
    ...baseModelTransferProps
}: ModelTranferProps<TModel, TModelData>) => {
    const queryFn = useBoundResourceQueryFn()
    const [searchTerm, setSearchTerm] = useState('')

    const searchFilter = `identifiable:token:${searchTerm}`
    const filter: string[] = searchTerm ? [searchFilter] : []
    const params = query.params

    const queryObject = {
        ...query,
        params: {
            ...defaultQuery.params,
            ...params,
            filter: filter.concat(params?.filter || []),
        },
    }
    const modelName = query.resource
    const newLink = useHref(`/${getSectionNewPath(modelName)}`)

    const queryResult = useInfiniteQuery({
        queryKey: [queryObject] as const,
        queryFn: queryFn<Response<TModel>>,
        keepPreviousData: true,
        getNextPageParam: (lastPage) =>
            lastPage.pager.nextPage ? lastPage.pager.page + 1 : undefined,
        getPreviousPageParam: (firstPage) =>
            firstPage.pager.prevPage ? firstPage.pager.page - 1 : undefined,
    })
    const allDataMap = useMemo(
        () => queryResult.data?.pages.flatMap((page) => page[modelName]) ?? [],
        [queryResult.data, modelName]
    )

    const transformedData = useMemo(
        () =>
            transform
                ? transform(allDataMap as unknown as TModelData[])
                : allDataMap,
        [allDataMap, transform]
    )

    const handleFilterChange = useDebouncedCallback(({ value }) => {
        if (value != undefined) {
            setSearchTerm(value)
        }
    }, 250)

    return (
        <BaseModelTransfer
            enableOrderChange
            height={'350px'}
            optionsWidth="500px"
            selectedWidth="500px"
            filterable
            filterablePicked
            onEndReached={queryResult.fetchNextPage}
            available={transformedData}
            selected={selected}
            onFilterChange={handleFilterChange}
            filterPlaceholder={
                filterPlaceholder || i18n.t('Filter available items')
            }
            filterPlaceholderPicked={
                filterPlaceholderPicked || i18n.t('Filter selected items')
            }
            leftHeader={<TransferHeader>{leftHeader}</TransferHeader>}
            rightHeader={<TransferHeader>{rightHeader}</TransferHeader>}
            leftFooter={
                leftFooter ?? (
                    <DefaultTransferLeftFooter
                        onRefreshClick={queryResult.refetch}
                        newLink={newLink}
                    />
                )
            }
            {...baseModelTransferProps}
        />
    )
}

export const TransferHeader = ({ children }: { children: React.ReactNode }) => {
    if (typeof children === 'string') {
        return <div className={css.modelTransferHeader}>{children}</div>
    }
    return <>{children}</>
}

const DefaultTransferLeftFooter = ({
    onRefreshClick,
    newLink,
}: {
    onRefreshClick: () => void
    newLink: string
}) => {
    return (
        <ButtonStrip className={css.modelTransferFooter}>
            <Button small onClick={onRefreshClick}>
                {i18n.t('Refresh list')}
            </Button>

            <LinkButton small href={newLink} target="_blank">
                {i18n.t('Add new')}
            </LinkButton>
        </ButtonStrip>
    )
}
