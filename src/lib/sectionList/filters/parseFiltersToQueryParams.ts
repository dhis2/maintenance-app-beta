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
): string | undefined => {
    if (!value) {
        return undefined
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
    if (key === 'categoryCombo') {
        return `categoryCombo.id:in:[${(value as string[]).join(',')}]`
    }
    return defaultFilter(key, value)
}

export const parseFiltersToQueryParams = (
    filters: ParsedFilterParams,
    section?: Section
): string[] => {
    const queryFilters = Object.entries(filters)
        .map(([key, value]) =>
            getQueryParamForFilter(key as FilterKey, value, section)
        )
        .filter(
            (queryFilter): queryFilter is string => queryFilter !== undefined
        )
    return queryFilters
}
