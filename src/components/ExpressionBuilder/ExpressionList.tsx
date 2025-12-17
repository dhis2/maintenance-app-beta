import i18n from '@dhis2/d2-i18n'
import { CircularLoader, Input } from '@dhis2/ui'
import { useInfiniteQuery } from '@tanstack/react-query'
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useDebouncedState } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PlainResourceQuery } from '../../types'
import { PagedResponse } from '../../types/generated'
import { PartialLoadedDisplayableModel } from '../../types/models'
import styles from './ExpressionBuilder.module.css'

type OnFilterChange = ({ value }: { value: string }) => void
interface ElementListProps {
    insertElement?: (s: string) => void
    onFilterChange?: OnFilterChange
    onEndReached?: () => void
    onRetryClick: () => void
    elements: InsertElement[]
    showEndLoader?: boolean
    loading?: boolean
    error?: string
    postQuerySearch?: boolean
}

const noop = () => {}

export const ExpressionListInner = ({
    error,
    loading,
    onEndReached,
    onFilterChange,
    onRetryClick,
    elements,
    showEndLoader,
    insertElement,
    postQuerySearch = false,
}: ElementListProps) => {
    const [loadingSpinnerRef, setLoadingSpinnerRef] = useState<HTMLElement>()

    const { liveValue: filter, setValue: setFilterValue } =
        useDebouncedState<string>({
            initialValue: '',
            onSetDebouncedValue: (value: string) =>
                postQuerySearch ? noop : onFilterChange?.({ value }),
        })

    const postQueryFilter = postQuerySearch
        ? (o: { id: string; displayName: string }) =>
              o.displayName.includes(filter)
        : () => true

    useEffect(() => {
        // We don't want to wait for intersections when loading as that can
        // cause buggy behavior
        if (loadingSpinnerRef && !loading) {
            const observer = new IntersectionObserver(
                (entries) => {
                    const [{ isIntersecting }] = entries

                    if (isIntersecting) {
                        onEndReached?.()
                    }
                },
                { threshold: 0.8 }
            )

            observer.observe(loadingSpinnerRef)
            return () => observer.disconnect()
        }
    }, [loadingSpinnerRef, loading, onEndReached])

    if (!elements) {
        return null
    }

    return (
        <div className={styles.expressionListContainer}>
            <div className={styles.searchField}>
                <div className={styles.searchInput}>
                    <Input
                        dense
                        initialFocus
                        value={filter}
                        onChange={({ value }) => setFilterValue(value ?? '')}
                        placeholder={i18n.t('Filter list')}
                        type="search"
                    />
                </div>
            </div>

            {elements.length === 0 && (
                <div className={styles.noMatchBlock}>
                    {i18n.t('No matches')}
                </div>
            )}
            <ul className={styles.elementList}>
                {elements.filter(postQueryFilter).map(({ id, displayName }) => (
                    <div
                        key={`variable_${id}`}
                        onClick={() => {
                            insertElement?.(id)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                insertElement?.(id)
                            }
                        }}
                    >
                        {displayName}
                    </div>
                ))}
            </ul>

            {!error && !loading && showEndLoader && (
                <Loader
                    ref={(ref) => {
                        if (!!ref && ref !== loadingSpinnerRef) {
                            setLoadingSpinnerRef(ref)
                        }
                    }}
                />
            )}

            {!error && loading && <Loader />}

            {error && <ErrorMessage msg={error} onRetryClick={onRetryClick} />}
        </div>
    )
}

type Response<Model> = PagedResponse<Model, string>

const defaultQuery = {
    params: {
        order: 'displayName:asc',
        fields: ['id', 'displayName'],
        pageSize: 10,
    },
} satisfies Omit<PlainResourceQuery, 'resource'>

export type ExpressionListProps<TModel> = {
    query: Omit<PlainResourceQuery, 'id'>
    transform?: (value: TModel[]) => TModel[]
    insertElement?: (s: string) => void
    postQuerySearch?: boolean
}

export const ExpressionList = <TModel extends PartialLoadedDisplayableModel>({
    query,
    transform,
    insertElement,
    postQuerySearch = false,
}: ExpressionListProps<TModel>) => {
    const queryFn = useBoundResourceQueryFn()
    const [searchTerm, setSearchTerm] = useState('')
    const [iterationsCount, setIterationsCount] = useState(0)

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
        getNextPageParam: (lastPage: Response<TModel>) =>
            lastPage.pager?.nextPage ? lastPage.pager.page + 1 : undefined,
        getPreviousPageParam: (firstPage: Response<TModel>) =>
            firstPage.pager?.prevPage ? firstPage.pager.page - 1 : undefined,
        staleTime: 60 * 1000,
    })

    const fetchNextPage = queryResult?.fetchNextPage

    const onEndReached = useCallback(() => {
        setIterationsCount((prev) => prev + 1)
        fetchNextPage()
    }, [setIterationsCount, fetchNextPage])

    const allDataMap = useMemo(() => {
        const flatData =
            queryResult.data?.pages.flatMap(
                (page) => page[modelName] as TModel[]
            ) ?? []
        return flatData
    }, [queryResult.data, modelName])

    const resolvedAvailable = useMemo(() => {
        const data = transform ? transform(allDataMap) : allDataMap
        return data?.filter(
            (item) => !!item.id && !!item.displayName
        ) as InsertElement[]
    }, [allDataMap, transform])

    useEffect(() => {
        // fetch until we have resolvedAvailable length equal to the desired page size (or until we reach the end)
        if (
            resolvedAvailable?.length <
                (iterationsCount + 1) * (queryObject.params.pageSize ?? 10) &&
            queryResult.hasNextPage
        ) {
            fetchNextPage({ cancelRefetch: true })
        }
    }, [
        resolvedAvailable?.length,
        queryObject.params.pageSize,
        queryResult.hasNextPage,
        fetchNextPage,
        iterationsCount,
        queryResult.data?.pages?.length, // necessary in case refetch results in no new resolvedAvailable
    ])

    const handleFilterChange = useDebouncedCallback(({ value }) => {
        if (value != undefined) {
            setSearchTerm(value)
        }
    }, 250)

    return (
        <ExpressionListInner
            insertElement={insertElement}
            elements={resolvedAvailable}
            onFilterChange={handleFilterChange}
            onRetryClick={queryResult.refetch}
            showEndLoader={!!queryResult.hasNextPage}
            onEndReached={onEndReached}
            loading={queryResult.isLoading}
            error={queryResult.error?.toString()}
            postQuerySearch={postQuerySearch}
        />
    )
}

export interface InsertElement {
    displayName: string
    id: string
}

const Loader = forwardRef<HTMLDivElement, object>(function Loader(_, ref) {
    return (
        <div ref={ref} className={styles.loader}>
            <CircularLoader small />
        </div>
    )
})

const ErrorMessage = ({
    msg,
    onRetryClick,
}: {
    msg: string
    onRetryClick: () => void
}) => {
    return (
        <div className={styles.error}>
            <div className={styles.errorInnerWrapper}>
                <span className={styles.loadingErrorLabel}>{msg}</span>
                <button
                    className={styles.errorRetryButton}
                    type="button"
                    onClick={onRetryClick}
                >
                    {i18n.t('Retry')}
                </button>
            </div>
        </div>
    )
}
