import { useQuery, QueryObserverOptions } from '@tanstack/react-query'
import { useBoundResourceQueryFn } from '../../../lib/query/useBoundQueryFn'
import { PagedResponse } from '../../../types/generated'
import { CategoryComboFormValues } from './categoryComboSchema'

type CategoriesValue = Pick<CategoryComboFormValues, 'categories'>['categories']

export type IdenticalCategoryCombosQueryResult = PagedResponse<
    CategoriesValue[number],
    'categoryCombos'
>

type UseIdenticalCategoryCombosQueryOptions = {
    categoryComboId?: string
    selectedCategories: CategoriesValue
} & Pick<
    QueryObserverOptions<IdenticalCategoryCombosQueryResult>,
    'enabled' | 'select' | 'cacheTime' | 'staleTime'
>

export const useIdenticalCategoryCombosQuery = ({
    categoryComboId,
    selectedCategories,
    ...queryOptions
}: UseIdenticalCategoryCombosQueryOptions) => {
    const queryFn = useBoundResourceQueryFn()
    const notSameCatComboFilter = `id:ne:${categoryComboId}`
    const idFilters = selectedCategories.map(
        (category) => `categories.id:eq:${category.id}`
    )
    const lengthFilter = `categories:eq:${selectedCategories.length}`
    const filters = [lengthFilter, ...idFilters]

    if (categoryComboId) {
        filters.push(notSameCatComboFilter)
    }
    const useIdenticalCategoryCombosQuery = {
        resource: 'categoryCombos',
        params: {
            fields: ['id', 'displayName'],
            filter: filters,
        },
    }

    return useQuery({
        staleTime: 60 * 1000,
        ...queryOptions,
        queryKey: [useIdenticalCategoryCombosQuery],
        queryFn: queryFn<IdenticalCategoryCombosQueryResult>,
    })
}
