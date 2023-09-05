import { uniq, uniqBy } from 'remeda'
import { SectionName } from './sections'
import { getTranslatedProperty } from './translatedModelProperties'

interface ModelPropertyDescriptor {
    label: string
    path: string
}

type ModelPropertyConfig = string | ModelPropertyDescriptor
interface ViewConfigPart {
    available?: ModelPropertyConfig[]
    overrideDefaultAvailable?: boolean
    default: ModelPropertyConfig[]
}

interface ViewConfig {
    columns: ViewConfigPart
    filters: ViewConfigPart
}

interface ResolvedViewConfigPart {
    available: ModelPropertyDescriptor[]
    default: ModelPropertyDescriptor[]
}
interface ResolvedViewConfig {
    columns: ResolvedViewConfigPart
    filters: ResolvedViewConfigPart
}

// generic here is just used for "satisfies" below, for code-completion of future customizations
type SectionListViewConfig<Key extends string = string> = {
    [key in Key]?: ViewConfig
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

const toModelPropertyDescriptor = (propertyConfig: ModelPropertyConfig) => {
    if (typeof propertyConfig === 'string') {
        return {
            label: getTranslatedProperty(propertyConfig),
            path: propertyConfig,
        }
    }
    return propertyConfig
}

const resolveViewPart = (part: ViewConfigPart, type: keyof ViewConfig) => {
    const mergedAvailableDescriptors = uniqBy(
        [
            part.default,
            part.available || [],
            part.overrideDefaultAvailable
                ? []
                : defaultModelViewConfig[type].available,
        ]
            .flat()
            .map(toModelPropertyDescriptor),
        (prop) => prop.path
    )
    const defaultPropConfig =
        part.default || defaultModelViewConfig[type].default
    const defaultDescriptors = defaultPropConfig.map(toModelPropertyDescriptor)
    return {
        available: mergedAvailableDescriptors,
        default: defaultDescriptors,
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
const resolvedDefaultConfig = {
    columns: resolveViewPart(defaultModelViewConfig.columns, 'columns'),
    filters: resolveViewPart(defaultModelViewConfig.filters, 'filters'),
}

export const getViewConfigForSection = (
    sectionName: string
): ResolvedViewConfig => {
    if (mergedModelViewsConfig[sectionName]) {
        return mergedModelViewsConfig[sectionName] as ResolvedViewConfig
    }
    return resolvedDefaultConfig
}

export const getColumnsForSection = (
    sectionName: string
): ResolvedViewConfig['columns'] => {
    const view = getViewConfigForSection(sectionName)
    return view.columns
}
