import i18n from '@dhis2/d2-i18n'
import { uniqueBy } from '../utils'
import type { SectionName } from './sections'
import { getTranslatedProperty } from './translatedModelProperties'

export interface ModelPropertyDescriptor {
    label: string
    path: string
}

type ModelPropertyConfig = string | ModelPropertyDescriptor
interface ViewConfigPart {
    available?: ReadonlyArray<ModelPropertyConfig>
    overrideDefaultAvailable?: boolean
    default?: ReadonlyArray<ModelPropertyConfig>
}

interface ViewConfig {
    columns: ViewConfigPart
    filters: ViewConfigPart
}

interface ResolvedViewConfigPart {
    available: ReadonlyArray<ModelPropertyDescriptor>
    default: ReadonlyArray<ModelPropertyDescriptor>
}
interface ResolvedViewConfig {
    columns: ResolvedViewConfigPart
    filters: ResolvedViewConfigPart
}

// generic here is just used for "satisfies" below, for code-completion of future customizations
type SectionListViewConfig<Key extends string = string> = {
    [key in Key]?: ViewConfig
}

const DESCRIPTORS = {
    publicAccess: { path: 'sharing.public', label: i18n.t('Public access') },
} satisfies Record<string, ModelPropertyDescriptor>

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
            DESCRIPTORS.publicAccess,
        ],
        default: ['name', 'sharing.public', 'lastUpdated'],
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
            available: [
                'zeroIsSignificant',
                'categoryCombo',
                // {
                //     label: i18n.t('Hello available public'),
                //     path: 'sharing.public',
                // },
            ],
            default: [
                'name',
                { label: i18n.t('Domain'), path: 'domainType' },
                { label: i18n.t('Value type'), path: 'valueType' },
                'lastUpdated',
                // 'sharing.public',
                { label: i18n.t('Hello public'), path: 'sharing.public' },
            ],
        },
        filters: {
            default: ['name', 'domainType', 'valueType'],
            available: ['zeroIsSignificant', 'categoryCombo'],
        },
    },
} satisfies SectionListViewConfig<SectionName>

const toModelPropertyDescriptor = (
    propertyConfig: ModelPropertyConfig,
    available?: ModelPropertyDescriptor[]
): ModelPropertyDescriptor => {
    if (typeof propertyConfig === 'string') {
        // simple descriptors can refer to previously defined descriptors
        const availableDescriptor = available?.find(
            (prop) => prop.path === propertyConfig
        )

        return (
            availableDescriptor || {
                label: getTranslatedProperty(propertyConfig),
                path: propertyConfig,
            }
        )
    }
    return propertyConfig
}

const resolveViewPart = (part: ViewConfigPart, type: keyof ViewConfig) => {
    const mergedAvailableDescriptors = uniqueBy(
        [
            part.available || [],
            part.overrideDefaultAvailable
                ? []
                : defaultModelViewConfig[type].available,
            part.default || [],
        ]
            .flat()
            .map((propConfig) => toModelPropertyDescriptor(propConfig)),
        (prop) => prop.path
    )
    const defaultPropConfig =
        part.default || defaultModelViewConfig[type].default
    const defaultDescriptors = defaultPropConfig.map((propConfig) =>
        toModelPropertyDescriptor(propConfig, mergedAvailableDescriptors)
    )
    return {
        available: mergedAvailableDescriptors,
        default: defaultDescriptors,
    }
}
// merge the default modelViewConfig with the modelViewsConfig for each section
const resolveListViewsConfig = (): SectionListViewConfig => {
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
