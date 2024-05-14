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

const inFilter = (filterPath: string, value: string[]) =>
    `${filterPath}:in:[${value.join(',')}]`

const defaultFilter = (
    key: FilterKey,
    value: NonNullable<AllValues>
): string => {
    if (Array.isArray(value)) {
        return inFilter(key, value)
    }
    return `${key}:eq:${value}`
}

/* Override how to resolve the actual queryParam (when used in a request) for a filter */

const filterToQueryParamMap: FilterToQueryParamsMap = {
    identifiable: (value) => `identifiable:token:${value}`,
    categoryCombo: (value) => inFilter('categoryCombo.id', value),
    dataSet: (value, section) =>
        section.name === SchemaName.dataElement
            ? inFilter('dataSetElements.dataSet.id', value)
            : defaultFilter('dataSet', value),
    dataElement: (value) => inFilter('dataElements.id', value),
    dataElementGroup: (value) => inFilter('dataElementGroups.id', value),
    publicAccess: (value) => inFilter('sharing.public', value),
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
