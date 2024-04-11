import i18n from '@dhis2/d2-i18n'
import { flow, get } from 'lodash/fp'
import { getTranslatedProperty } from '../constants/translatedModelProperties'
import { uniqueBy } from '../utils'
import type { ConfigurableFilterKey } from './filters'

export interface ModelPropertyDescriptor {
    label: string
    path: string
}

export interface FilterDescriptor {
    label: string
    filterKey: ConfigurableFilterKey
}

type Descriptor =
    | (ModelPropertyDescriptor & Partial<FilterDescriptor>)
    | (FilterDescriptor & Partial<ModelPropertyDescriptor>)

/* Configs can either define the label and filterKey, or a string
If config is a string, getTranslatedProperty will be used to get the label. */
type FilterConfig = ConfigurableFilterKey | FilterDescriptor
type ModelPropertyConfig = string | ModelPropertyDescriptor

interface UntranslatedViewConfigPart<TEntry> {
    available: ReadonlyArray<TEntry>
    overrideDefaultAvailable?: boolean
    default: ReadonlyArray<TEntry>
}

interface UntranslatedViewConfig {
    columns: UntranslatedViewConfigPart<ModelPropertyConfig>
    filters: UntranslatedViewConfigPart<FilterConfig>
}

interface ViewConfigPart<TEntry> {
    available: ReadonlyArray<TEntry>
    default: ReadonlyArray<TEntry>
}

interface ViewConfig {
    columns: ViewConfigPart<ModelPropertyDescriptor>
    filters: ViewConfigPart<FilterDescriptor>
}

interface SectionListView {
    [key: string]: ViewConfig
}

const DESCRIPTORS = {
    publicAccess: {
        path: 'sharing.public',
        label: i18n.t('Public access'),
        filterKey: 'publicAccess',
    },
} satisfies Record<string, Descriptor>

const toModelPropertyDescriptor = (
    propertyConfig: ModelPropertyConfig
): ModelPropertyDescriptor => {
    if (typeof propertyConfig === 'string') {
        return {
            label: getTranslatedProperty(propertyConfig),
            path: propertyConfig,
        }
    }
    return propertyConfig
}

export const toFilterDescriptor = (
    propertyConfig: FilterConfig
): FilterDescriptor => {
    if (typeof propertyConfig === 'string') {
        return {
            label: getTranslatedProperty(propertyConfig),
            filterKey: propertyConfig,
        }
    }
    return propertyConfig
}

function mergeConfigs<TEntry>(...configs: ReadonlyArray<TEntry>[]) {
    return uniqueBy(configs.flat(), get('path'))
}

const translateConfig = (config: UntranslatedViewConfig): ViewConfig => ({
    columns: {
        available: config.columns.available.map(toModelPropertyDescriptor),
        default: config.columns.default.map(toModelPropertyDescriptor),
    },
    filters: {
        available: config.filters.available.map(toFilterDescriptor),
        default: config.filters.default.map(toFilterDescriptor),
    },
})

const mergeDefaultsIntoAvailable = (config: ViewConfig): ViewConfig => ({
    columns: {
        available: mergeConfigs(
            config.columns.available,
            config.columns.default
        ),
        default: config.columns.default,
    },
    filters: {
        available: mergeConfigs(
            config.filters.available,
            config.filters.default
        ),
        default: config.filters.default,
    },
})

const processConfig: (config: UntranslatedViewConfig) => ViewConfig = flow(
    translateConfig,
    mergeDefaultsIntoAvailable
)

// This is the default views, and can be overriden per section in modelListViewsConfig below
const defaultModelViewConfig = processConfig({
    columns: {
        available: ['shortName', 'code', 'created', 'createdBy', 'href', 'id'],
        default: ['name', DESCRIPTORS.publicAccess, 'lastUpdated'],
    },
    filters: {
        available: [],
        default: [
            // NOTE: Identifiable is special, and is always included in the default filters
            // It should not be handled the same way as "configurable" filters
        ],
    },
})

const withDefaults = (config: ViewConfig): ViewConfig => ({
    columns: {
        available: mergeConfigs(
            config.columns.available,
            defaultModelViewConfig.columns.available
        ),
        default: mergeConfigs(
            config.columns.default,
            defaultModelViewConfig.columns.default
        ),
    },
    filters: {
        available: mergeConfigs(
            config.filters.available,
            defaultModelViewConfig.filters.available
        ),
        default: mergeConfigs(
            config.filters.default,
            defaultModelViewConfig.filters.default
        ),
    },
})

// this is the default views (eg. which columns and filters) to show in the
// List-page for each section
const modelListViewsConfig: SectionListView = {
    dataElement: flow(
        processConfig,
        withDefaults
    )({
        columns: {
            available: ['zeroIsSignificant'],
            default: [
                'name',
                'domainType',
                'valueType',
                'categoryCombo',
                'lastUpdated',
                DESCRIPTORS.publicAccess,
            ],
        },
        filters: {
            available: ['domainType', 'valueType', 'dataSet', 'categoryCombo'],
            default: [DESCRIPTORS.publicAccess],
        },
    }),
}

export const getViewConfigForSection = (sectionName: string): ViewConfig =>
    modelListViewsConfig[sectionName] || defaultModelViewConfig

export const getColumnsForSection = (
    sectionName: string
): ViewConfig['columns'] => getViewConfigForSection(sectionName).columns

export const getFiltersForSection = (
    sectionName: string
): ViewConfig['filters'] => getViewConfigForSection(sectionName).filters
