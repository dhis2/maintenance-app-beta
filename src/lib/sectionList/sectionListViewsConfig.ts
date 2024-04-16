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

// NOTE: Identifiable is special, and is always displayed
// It should not be handled the same way as "configurable" filters
export const modelListViewsConfig: SectionListView = {
    default: {
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
            default: ['name', 'sharing.public', 'lastUpdated'],
        },
        filters: {
            available: [],
            default: [],
        },
    },
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
                'name',
                'domainType',
                'valueType',
                'categoryCombo',
                'lastUpdated',
                'sharing.public',
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
    modelListViewsConfig[sectionName] || modelListViewsConfig.default

export const getColumnsForSection = (
    sectionName: string
): ViewConfig['columns'] => getViewConfigForSection(sectionName).columns

export const getFiltersForSection = (
    sectionName: string
): ViewConfig['filters'] => getViewConfigForSection(sectionName).filters
