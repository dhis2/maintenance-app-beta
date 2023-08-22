import { uniq } from 'remeda'
import { SectionName } from './sections'

interface ViewConfigPart {
    available?: string[]
    overrideDefaultAvailable?: boolean
    default: string[]
}

type ViewConfig = {
    columns: ViewConfigPart
    filters: ViewConfigPart
}

type ResolvedViewConfigPart = {
    available: string[]
    default: string[]
}
type ResolvedViewConfig = {
    columns: ResolvedViewConfigPart
    filters: ResolvedViewConfigPart
}

// generic here is just used for "satisfies" below, for code-completion of future customizations
type SectionListViewConfig<Key extends string = string> = {
    [key in Key]?: ResolvedViewConfig
}

// This is the default views, and can be overriden per section in modelListViewsConfig below
const defaultModelViewConfig = {
    columns: {
        available: [
            'name',
            'shortName',
            'code',
            'created',
            'createdBy',
            'href',
            'id',
            'lastUpdatedBy',
        ],
        default: ['name', 'sharing', 'lastUpdated'],
    },
    filters: {
        available: ['name'],
        default: ['name'],
    },
} satisfies ViewConfig

// this is the default views (eg. which columns and filters) to show in the List-page for each section
// Note: by default, the available columns are merged with columnsDefault.available above.
// If it's needed to override this for a section, set overrideDefaultAvailable to true
// and list all available columns in the available array below.
// Default-list will NOT be merged with columnsDefault.default - list all explicitly.
// elements in the default array implies they are also available, no need to list them in both.

const modelListViewsConfig = {
    dataElement: {
        columns: {
            default: [
                'name',
                'domainType',
                'valueType',
                'lastUpdated',
                'sharing',
            ],
            available: ['zeroIsSignificant', 'categoryCombo'],
        },
        filters: {
            default: ['name', 'domainType', 'valueType'],
            available: ['zeroIsSignificant', 'categoryCombo'],
        },
    },
} satisfies SectionListViewConfig<SectionName>

const mergeArraysUnique = <T>(...arrays: T[][]): T[] => uniq(arrays.flat())

const resolveViewPart = (part: ViewConfigPart, type: keyof ViewConfig) => {
    const mergedAvailable = mergeArraysUnique(
        part.default,
        part.available || [],
        part.overrideDefaultAvailable
            ? []
            : defaultModelViewConfig[type].available
    )
    return {
        available: mergedAvailable,
        default: part.default || defaultModelViewConfig[type].default,
    }
}
// merge the default modelViewConfig with the modelViewsConfig for each section
const resolveListViewsConfig = () => {
    const merged: SectionListViewConfig = {}

    Object.entries(modelListViewsConfig).forEach((viewConfig) => {
        const [sectionName, sectionViewConfig] = viewConfig
        merged[sectionName as SectionName] = {
            columns: resolveViewPart(sectionViewConfig.columns, 'columns'),
            filters: resolveViewPart(sectionViewConfig.filters, 'filters'),
        }
    })
    return merged
}

const mergedModelViewsConfig = resolveListViewsConfig()

export const getViewForSection = (sectionName: string): ResolvedViewConfig => {
    if (mergedModelViewsConfig[sectionName]) {
        return mergedModelViewsConfig[sectionName] as ResolvedViewConfig
    }
    return defaultModelViewConfig
}

export const getColumnsForSection = (
    sectionName: string
): ResolvedViewConfig['columns'] => {
    const view = getViewForSection(sectionName)
    return view.columns
}
