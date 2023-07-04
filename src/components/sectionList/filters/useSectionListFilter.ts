import { useQueryParam, ObjectParam } from 'use-query-params'

export const useSectionListFilter = () => {
    const [filter, setFilter] = useQueryParam('filter', ObjectParam)
}
