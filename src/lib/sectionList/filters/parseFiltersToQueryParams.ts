import { ModelSection } from '../../../types'
import { Section } from '../../constants'
import { SchemaName } from '../../schemas'
import { FilterKey, ParsedFilterParams } from './filterConfig'

type AllValues = ParsedFilterParams[keyof ParsedFilterParams]

/* Type to resolve the correct type for the value of the filter-handler based on the parsed type */
type FilterToQueryParamsMap = {
    [key in keyof ParsedFilterParams]: (
        value: NonNullable<ParsedFilterParams[key]>,
        section: Section
    ) => string
}

/* Override how to resolve the actual queryParam (when used in a request) for a filter */

const filterToQueryParamMap: FilterToQueryParamsMap = {
    identifiable: (value) => `identifiable:token:${value}`,
    dataSet: (value, section) =>
        section.name === SchemaName.dataElement
            ? `dataSetElements.dataSet.id:in:[${value.join(',')}]`
            : defaultFilter('dataSet', value),
    aggregationType: (value) => `aggregationType:in:[${value.join(',')}]`,
}

const defaultFilter = (key: FilterKey, value: AllValues): string => {
    const isArray = Array.isArray(value)
    const valuesString = isArray ? `[${value.join(',')}]` : value?.toString()
    const operator = isArray ? 'in' : 'eq'
    return `${key}:${operator}:${valuesString}`
}

const getQueryParamForFilter = (
    key: FilterKey,
    value: AllValues,
    section: ModelSection
): string | undefined => {
    if (!value) {
        return undefined
    }
    const filterHandler = filterToQueryParamMap[key]
    if (filterHandler) {
        // see https://www.totaltypescript.com/as-never#unions-of-functions-with-incompatible-params
        // this is fine
        return filterHandler(value as never, section)
    }

    return defaultFilter(key, value)
}

export const parseFiltersToQueryParams = (
    filters: ParsedFilterParams,
    section: ModelSection
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
