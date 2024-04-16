interface ViewConfigPart {
    available: string[]
    default: string[]
}

interface ViewConfig {
    columns: ViewConfigPart
    filters: ViewConfigPart
}

interface SectionListView {
    [key: string]: ViewConfig
}

export const defaultModelViewConfig = {
    columns: {
        available: [
            'code',
            'created',
            'createdBy',
            'href',
            'id',
            'lastUpdated',
            'name',
            'sharing.public',
            'shortName',
        ],
        default: ['lastUpdated', 'name', 'sharing.public'],
    },
    filters: {
        available: [],
        default: [
            // NOTE: Identifiable is special, and is always included in the default filters
            // It should not be handled the same way as "configurable" filters
        ],
    },
}

export const modelListViewsConfig: SectionListView = {
    dataElement: {
        columns: {
            available: [
                'categoryCombo',
                'code',
                'created',
                'createdBy',
                'domainType',
                'href',
                'id',
                'lastUpdated',
                'name',
                'sharing.public',
                'shortName',
                'valueType',
                'zeroIsSignificant',
            ],
            default: [
                'categoryCombo',
                'domainType',
                'lastUpdated',
                'name',
                'sharing.public',
                'valueType',
            ],
        },
        filters: {
            available: [
                'categoryCombo',
                'dataSet',
                'domainType',
                'valueType',
                'publicAccess',
            ],
            default: ['publicAccess'],
        },
    },
}

export const getViewConfigForSection = (sectionName: string): ViewConfig =>
    modelListViewsConfig[sectionName] || defaultModelViewConfig

export const getColumnsForSection = (
    sectionName: string
): ViewConfig['columns'] => getViewConfigForSection(sectionName).columns

export const getFiltersForSection = (
    sectionName: string
): ViewConfig['filters'] => getViewConfigForSection(sectionName).filters
