import { Transfer, TransferProps } from '@dhis2/ui'
import React, {
    forwardRef,
    RefAttributes,
    useImperativeHandle,
    useMemo,
    useState,
} from 'react'
import { useInfiniteQuery } from 'react-query'
import { useBoundResourceQueryFn } from '../../../lib/query/useBoundQueryFn'
import { PlainResourceQuery } from '../../../types'
import { PagedResponse } from '../../../types/generated'

type Response<Model> = PagedResponse<Model, string>

export type DisplayableModel = {
    id: string
    displayName: string
}

const defaultQuery = {
    params: {
        order: 'displayName:asc',
        fields: ['id', 'displayName'],
    },
}

const toDisplayOption = (model: DisplayableModel) => ({
    value: model.id,
    label: model.displayName,
})

type OwnProps<TModel> = {
    selected: TModel[]
    onChange: ({ selected }: { selected: TModel[] }) => void
    query: PlainResourceQuery
}
type ModelTransferProps<TModel> = Omit<
    TransferProps,
    | keyof OwnProps<TModel>
    | 'options'
    | 'selected'
    | 'filterable'
    | 'onFilterChange'
> &
    OwnProps<TModel>

type ImperativeRef = { refetch: () => void }

const BaseModelTransfer = <TModel extends DisplayableModel>(
    { selected, onChange, query, ...transferProps }: ModelTransferProps<TModel>,
    ref: React.Ref<ImperativeRef>
) => {
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

    const queryResult = useInfiniteQuery({
        queryKey: [queryObject] as const,
        queryFn: queryFn<Response<TModel>>,
        keepPreviousData: true,
        getNextPageParam: (lastPage) =>
            lastPage.pager.nextPage ? lastPage.pager.page + 1 : undefined,
        getPreviousPageParam: (firstPage) =>
            firstPage.pager.prevPage ? firstPage.pager.page - 1 : undefined,
    })

    useImperativeHandle(ref, () => ({
        refetch: () => queryResult.refetch(),
    }))

    const allDataMap = useMemo(
        () =>
            new Map(
                queryResult.data?.pages.flatMap((page) =>
                    page[modelName].map((d) => [d.id, d] as const)
                )
            ),
        [queryResult.data, modelName]
    )

    const selectedOptions = selected ? selected?.map(toDisplayOption) : []
    const loadedOptions = Array.from(allDataMap.values()).map(toDisplayOption)
    // always include selected options
    const allOptions = selectedOptions.concat(loadedOptions || [])

    const handleOnChange = ({ selected }: { selected: string[] }) => {
        // map the selected ids to the full model
        // loop through selected to keep order
        const selectedModels = selected
            .map((id) => allDataMap.get(id))
            .filter((model): model is TModel => !!model)

        onChange({
            selected: selectedModels,
        })
    }

    return (
        <Transfer
            filterablePicked={true}
            loadingPicked={false}
            loading={queryResult.isFetching}
            {...transferProps}
            options={allOptions}
            filterable
            searchTerm={searchTerm}
            onEndReached={queryResult.fetchNextPage}
            onFilterChange={({ value }) =>
                value !== undefined && setSearchTerm(value)
            }
            selected={selectedOptions.map((o) => o.value)}
            onChange={handleOnChange}
        />
    )
}

// this is needed to support generics with ref-forwarding
interface ModelTransferWithForwardedRef
    extends React.FC<ModelTransferProps<DisplayableModel>> {
    <TModel extends DisplayableModel>(
        props: ModelTransferProps<TModel> & RefAttributes<ImperativeRef>
    ): React.ReactNode
}

export const ModelTransfer: ModelTransferWithForwardedRef =
    forwardRef(BaseModelTransfer)
