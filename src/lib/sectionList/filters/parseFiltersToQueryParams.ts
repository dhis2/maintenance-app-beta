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
    formName: (value) => `displayFormName:ilike:${value}`,
    category: (value) => inFilter('categories.id', value),
    categoryOption: (value) => inFilter('categoryOptions.id', value),
    indicatorType: (value) => inFilter('indicatorType.id', value),
    categoryCombo: (value, section) => {
        if (section.name === 'category') {
            return inFilter('categoryCombos.id', value)
        }
        return inFilter('categoryCombo.id', value)
    },
    categoryOptionGroup: (value) => inFilter('categoryOptionGroups.id', value),
    categoryOptionGroupSet: (value) => inFilter('groupSets.id', value),
    dataSet: (value, section) => {
        if (section.name === SchemaName.dataElement) {
            return inFilter('dataSetElements.dataSet.id', value)
        }
        if (section.name === SchemaName.dataSetNotificationTemplate) {
            return inFilter('dataSets.id', value)
        }
        return defaultFilter('dataSet', value)
    },
    dataElementGroup: (value) => inFilter('dataElementGroups.id', value),
    dataElement: (value) => inFilter('dataElements.id', value),
    dataElementGroupSet: (value) => inFilter('groupSets.id', value),
    publicAccess: (value) => inFilter('sharing.public', value),
    indicator: (value) => {
        return inFilter('indicators.id', value)
    },
    indicatorGroup: (value) => inFilter('indicatorGroups.id', value),
    indicatorGroupSet: (value, section) => {
        if (section.name === SchemaName.indicatorGroup) {
            // reference fieldname is groupSets
            return inFilter('groupSets.id', value)
        }
        return inFilter('indicatorGroupSets.id', value)
    },
    program: (value) => inFilter('program.id', value),
    programIndicator: (value) => inFilter('programIndicators.id', value),
    programIndicatorGroup: (value) =>
        inFilter('programIndicatorGroups.id', value),
    organisationUnitGroup: (value) =>
        inFilter('organisationUnitGroups.id', value),
    organisationUnitGroupSet: (value) => inFilter('groupSets.id', value),
    validationRuleGroup: (value) => inFilter('validationGroups.id', value),
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
