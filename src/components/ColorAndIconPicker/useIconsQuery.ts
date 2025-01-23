import { useMemo } from 'react'
import { useQuery, useInfiniteQuery } from 'react-query'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PagedResponse } from './../../types/generated/utility'
import { ResourceQuery } from './../../types/query'

export interface Icon {
    description: string
    href: string
    key: string
    keywords?: string[]
    fileResource: { id: string }
}

type IconsResponse = PagedResponse<Icon, 'icons'>

export const useIconQuery = ({ key: iconKey }: { key: string }) => {
    const queryFn = useBoundResourceQueryFn()

    return useQuery({
        queryKey: [
            {
                resource: 'icons',
                id: iconKey,
            } satisfies ResourceQuery,
        ],
        enabled: !!iconKey,
        queryFn: queryFn<Icon>,
    })
}

type UseIconsQueryOptions = {
    search?: string
    type?: 'all' | 'default' | 'custom'
}

const iconsPerRow = 13
export function useIconsQuery({ search, type }: UseIconsQueryOptions = {}) {
    const queryFn = useBoundResourceQueryFn()
    const params = {
        pageSize: iconsPerRow * 11,
        type: type || 'all',
        ...(search ? { search } : undefined),
    }
    const result = useInfiniteQuery({
        queryKey: [
            {
                resource: 'icons',
                params,
            } satisfies ResourceQuery,
        ],
        queryFn: queryFn<IconsResponse>,
        getNextPageParam: (lastPage) =>
            lastPage.pager.pageCount > lastPage.pager.page
                ? lastPage.pager.page + 1
                : undefined,
    })

    const allData = useMemo(
        () => result.data?.pages.flatMap((page) => page.icons) ?? [],
        [result.data]
    )

    return {
        allData,
        ...result,
    }
}
