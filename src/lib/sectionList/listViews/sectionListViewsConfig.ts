import i18n from '@dhis2/d2-i18n'
import type { ConfigurableFilterKey } from '../filters'

export interface ModelPropertyDescriptor {
    label: string
    path: string
}

export interface FilterDescriptor {
    label: string
    filterKey: ConfigurableFilterKey
}

/* Configs can either define the label and filterKey, or a string
If config is a string, getTranslatedProperty will be used to get the label.  */

export type FilterConfig = ConfigurableFilterKey | FilterDescriptor

export type ModelPropertyConfig = string | ModelPropertyDescriptor

export interface ViewConfigPart<TEntry> {
    available?: ReadonlyArray<TEntry>
    overrideDefaultAvailable?: boolean
    default?: ReadonlyArray<TEntry>
}

export interface ViewConfig {
    columns: ViewConfigPart<ModelPropertyConfig>
    filters: ViewConfigPart<FilterConfig>
}

// generic here is just used for "satisfies" below, for code-completion of future customizations
// cant use "[key in SectionName]" here, because section.name might be a "string"
export type SectionListViewConfig<Key extends string = string> = {
    [key in Key]?: ViewConfig
}

const DESCRIPTORS = {
    publicAccess: { path: 'sharing.public', label: i18n.t('Public access') },
} satisfies Record<string, ModelPropertyDescriptor>

const FILTERS = {
    categoryCombo: {
        filterKey: 'categoryCombo',
        label: i18n.t('Category combo'),
    },
    dataSet: { filterKey: 'dataSet', label: i18n.t('Data set') },
    publicAccess: {
        filterKey: 'publicAccess',
        label: i18n.t('Public access'),
    },
} satisfies Record<string, FilterDescriptor>

// This is the default views, and can be overriden per section in modelListViewsConfig below
export const defaultModelViewConfig = {
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
        default: ['name', DESCRIPTORS.publicAccess, 'lastUpdated'],
    },
    filters: {
        available: [],
        default: [
            // NOTE: Identifiable is special, and is always included in the default filters
            // It should not be handled the same way as "configurable" filters
        ],
    },
} satisfies ViewConfig

/* this is the default views (eg. which columns and filters) to show in the List-page for each section
	Note: by default, the available columns are merged with columnsDefault.available above.
	If it's needed to override this for a section, set overrideDefaultAvailable to true
	and list all available columns in the available array below.
	Default-list will NOT be merged with columnsDefault.default - list all explicitly.
	elements in the default array implies they are also available, no need to list them in both. */

export const modelListViewsConfig = {
    dataElement: {
        columns: {
            available: ['zeroIsSignificant', DESCRIPTORS.publicAccess],
            default: [
                'name',
                { label: i18n.t('Domain'), path: 'domainType' },
                { label: i18n.t('Value type'), path: 'valueType' },
                'categoryCombo',
                'lastUpdated',
            ],
        },
        filters: {
            default: [
                'domainType',
                'valueType',
                FILTERS.dataSet,
                'categoryCombo',
            ],
            available: ['categoryCombo', FILTERS.publicAccess],
        },
    },
} satisfies SectionListViewConfig
