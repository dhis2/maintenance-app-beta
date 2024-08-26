import { Transfer } from '@dhis2/ui'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { useBoundResourceQueryFn } from '../../../lib/query/useBoundQueryFn'
import { PlainResourceQuery, ResourceQuery } from '../../../types'
import { PagedResponse } from '../../../types/generated'

type ModelTransferProps<TModel> = {
    filterPlaceHolder: string
    selected: TModel[]
    onChange: ({ selected }: { selected: TModel[] }) => void
    query: PlainResourceQuery
}

type Response<Model> = PagedResponse<Model, string>

export type DisplayableModel = {
    id: string
    displayName: string
}

const defaultQuery = {
    params: {
        order: 'displayName:asc',
        fields: ['id', 'displayName'],
        // filter: ['isDefault:eq:false'],
    },
}

const toDisplayOption = (model: DisplayableModel) => ({
    value: model.id,
    label: model.displayName,
})

export const ModelTransfer = forwardRef(function ModelTransfer<
    TModel extends DisplayableModel
>(props: ModelTransferProps<TModel>, ref: React.Ref<{ refetch: () => void }>) {
    const queryFn = useBoundResourceQueryFn()
    const [searchTerm, setSearchTerm] = useState('')

    const searchFilter = `identifiable:token:${searchTerm}`
    const filter: string[] = searchTerm ? [searchFilter] : []
    const params = props.query.params

    const query = {
        ...props.query,
        params: {
            ...defaultQuery.params,
            ...props.query.params,
            filter: filter.concat(params?.filter || []),
        },
    }
    const modelName = query.resource

    const queryResult = useInfiniteQuery({
        queryKey: [query] as const,
        queryFn: ({ pageParam = 1, queryKey: [q], ...rest }) =>
            queryFn<Response<TModel>>({
                ...rest,
                queryKey: [
                    {
                        ...q,
                        params: {
                            ...q.params,
                            page: pageParam,
                        },
                    },
                ],
            }),
        keepPreviousData: true,
        getNextPageParam: (lastPage) =>
            lastPage.pager.nextPage ? lastPage.pager.page + 1 : undefined,
        getPreviousPageParam: (firstPage) =>
            firstPage.pager.prevPage ? firstPage.pager.page - 1 : undefined,
    })

    useImperativeHandle(ref, () => ({
        refetch: () => queryResult.refetch(),
    }))

    const selectedOptions = props.selected.map(toDisplayOption)

    const loadedOptions = queryResult.data?.pages.flatMap((page) =>
        page[modelName].map(toDisplayOption)
    )

    const allOptions = selectedOptions.concat(loadedOptions || [])

    /* We need to find the full model, because what we get back is just a string */
    const handleOnChange = ({ selected }: { selected: string[] }) => {
        const selectedModels = queryResult.data?.pages.flatMap((page) =>
            page[modelName].filter((model) => selected.includes(model.id))
        )

        if (selectedModels) {
            props.onChange({
                selected: selectedModels,
            })
        }
    }

    return (
        <Transfer
            loading={queryResult.isFetching}
            loadingPicked={false}
            filterable
            filterPlaceholder={props.filterPlaceHolder || 'Filter'}
            searchTerm={searchTerm}
            options={allOptions}
            onEndReached={queryResult.fetchNextPage}
            onFilterChange={({ value }) =>
                value !== undefined && setSearchTerm(value)
            }
            selected={selectedOptions.map((o) => o.value)}
            onChange={handleOnChange}
            selectedWidth="50%"
            optionsWidth="50%"
            leftFooter={props.leftFooter}
            rightHeader={props.rightHeader}
        ></Transfer>
    )
})
