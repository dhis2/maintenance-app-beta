import { SECTIONS_MAP, Section } from '../../constants'
import { FilterKey, ParsedFilterParams } from './filterConfig'

type AllValues = ParsedFilterParams[keyof ParsedFilterParams]

const defaultFilter = (key: FilterKey, value: AllValues): string => {
    const isArray = Array.isArray(value)
    const valuesString = isArray ? `[${value.join(',')}]` : value?.toString()
    const operator = isArray ? 'in' : 'eq'
    return `${key}:${operator}:${valuesString}`
}

const getQueryParamForFilter = (
    key: FilterKey,
    value: AllValues,
    section?: Section
): string => {
    if (!value) {
        return ''
    }
    if (key === 'identifiable') {
        return `identifiable:token:${value}`
    }
    if (key === 'dataSet') {
        const v = value as string[]
        if (section?.name === SECTIONS_MAP.dataElement.name) {
            return `dataSetElements.dataSet.id:in:[${v.join(',')}]`
        }
    }
    return defaultFilter(key, value)
}

export const parseFiltersToQueryParams = (
    filters: ParsedFilterParams,
    section?: Section
): string[] => {
    const queryFilters: string[] = []
    for (const [key, value] of Object.entries(filters)) {
        if (!value) {
            continue
        }
        const filter = getQueryParamForFilter(key as FilterKey, value, section)
        queryFilters.push(filter)
    }
    return queryFilters
}
