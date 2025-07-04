import i18n from '@dhis2/d2-i18n'
import { SectionName } from '../../constants'
import type { ConfigurableFilterKey } from '../filters'

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
    publicAccess: {
        path: 'sharing.public',
        label: i18n.t('Public access'),
        filterKey: 'publicAccess',
    },
    name: {
        path: 'displayName',
        label: i18n.t('Name'),
    },
    shortName: {
        path: 'displayShortName',
        label: i18n.t('Short name'),
    },
} satisfies Record<string, Descriptor>

// This is the default views, and can be overriden per section in modelListViewsConfig below
export const defaultModelViewConfig = {
    columns: {
        available: [
            DESCRIPTORS.name,
            'code',
            'created',
            'createdBy',
            'href',
            'id',
            'lastUpdatedBy',
            'lastUpdated',
            DESCRIPTORS.publicAccess,
        ],
        default: [DESCRIPTORS.name, DESCRIPTORS.publicAccess, 'lastUpdated'],
    },
    filters: {
        available: [DESCRIPTORS.publicAccess],
        default: [
            // NOTE: Identifiable is special, and is always included in the default filters
            // It should not be handled the same way as "configurable" filters
        ],
    },
} satisfies ViewConfig

const defaultAvailableColumnsNoSharing =
    defaultModelViewConfig.columns.available.filter(
        (col) => col !== DESCRIPTORS.publicAccess
    )

/* this is the default views (eg. which columns and filters) to show in the List-page for each section
	Note: by default, the available columns are merged with columnsDefault.available above.
	If it's needed to override this for a section, set overrideDefaultAvailable to true
	and list all available columns in the available array below.
	Default-list will NOT be merged with columnsDefault.default - list all explicitly.
	elements in the default array implies they are also available, no need to list them in both. */

export const modelListViewsConfig = {
    dataElement: {
        columns: {
            available: [DESCRIPTORS.shortName, 'zeroIsSignificant'],
            default: [
                DESCRIPTORS.name,
                { label: i18n.t('Domain type'), path: 'domainType' },
                { label: i18n.t('Value type'), path: 'valueType' },
                'categoryCombo',
                'lastUpdated',
                DESCRIPTORS.publicAccess,
            ],
        },
        filters: {
            available: [],
            default: ['domainType', 'valueType', 'dataSet', 'categoryCombo'],
        },
    },
    dataElementGroup: {
        columns: {
            available: [DESCRIPTORS.shortName],
        },
        filters: {
            default: ['dataElement', 'dataElementGroupSet'],
        },
    },
    dataElementGroupSet: {
        columns: {
            available: [DESCRIPTORS.shortName],
        },
        filters: {
            available: ['compulsory', 'dataDimension'],
            default: ['dataElementGroup'],
        },
    },
    dataSet: {
        columns: {
            default: [
                DESCRIPTORS.name,
                { label: i18n.t('Form type'), path: 'formType' },
                { label: i18n.t('Period type'), path: 'periodType' },
                'lastUpdated',
                DESCRIPTORS.publicAccess,
            ],
            available: [DESCRIPTORS.shortName],
        },
        filters: {
            default: ['formType'],
        },
    },
    dataSetNotificationTemplate: {
        columns: {
            available: [
                DESCRIPTORS.shortName,
                { label: i18n.t('Message template'), path: 'messageTemplate' },
                { label: i18n.t('Favourite'), path: 'favourite' },
                {
                    label: i18n.t('Data set notification trigger'),
                    path: 'dataSetNotificationTrigger',
                },
                {
                    label: i18n.t('Notification recipient'),
                    path: 'notificationRecipient',
                },
                {
                    label: i18n.t('Notify parent organisation unit only'),
                    path: 'notifyParentOrganisationUnitOnly',
                },
                {
                    label: i18n.t('Notify users in hierarchy only'),
                    path: 'notifyUsersInHierarchyOnly',
                },
                { label: i18n.t('Owner'), path: 'user.displayName' },
                {
                    label: i18n.t('Relative scheduled days'),
                    path: 'relativeScheduledDays',
                },
                { label: i18n.t('Send notification as'), path: 'sendStrategy' },
                { label: i18n.t('Subject template'), path: 'subjectTemplate' },
            ],
        },
        filters: {
            default: [],
        },
    },
    organisationUnit: {
        columns: {
            available: [DESCRIPTORS.shortName],
            default: [DESCRIPTORS.name, 'id', 'code', 'lastUpdated'],
        },
        filters: {
            default: [],
            overrideDefaultAvailable: true,
        },
    },
    organisationUnitLevel: {
        columns: {
            available: [
                DESCRIPTORS.name,
                'id',
                { label: i18n.t('Level'), path: 'level' },
                { label: i18n.t('Offline levels'), path: 'offlineLevels' },
                'lastUpdated',
            ],
            default: [
                DESCRIPTORS.name,
                { label: i18n.t('Offline levels'), path: 'offlineLevels' },
                'lastUpdated',
            ],
            overrideDefaultAvailable: true,
        },
        filters: {
            default: [],
            overrideDefaultAvailable: true,
        },
    },
    organisationUnitGroup: {
        columns: {
            available: [DESCRIPTORS.shortName],
            default: [DESCRIPTORS.name, 'id', 'code', 'lastUpdated'],
        },
        filters: {
            default: [],
            overrideDefaultAvailable: true,
        },
    },
    organisationUnitGroupSet: {
        columns: {
            available: [DESCRIPTORS.shortName],
            default: [DESCRIPTORS.name, 'id', 'code', 'lastUpdated'],
        },
        filters: {
            default: [],
            overrideDefaultAvailable: true,
        },
    },
    categoryOption: {
        columns: {
            available: [
                DESCRIPTORS.name,
                DESCRIPTORS.shortName,
                'code',
                'created',
                'createdBy',
                'href',
                'id',
                DESCRIPTORS.publicAccess,
            ],
            default: [
                DESCRIPTORS.name,
                DESCRIPTORS.publicAccess,
                'lastUpdated',
            ],
            overrideDefaultAvailable: true,
        },
        filters: {
            default: ['category', 'categoryOptionGroup'],
        },
    },
    category: {
        columns: {
            default: [
                DESCRIPTORS.name,
                'dataDimensionType',
                DESCRIPTORS.publicAccess,
                'lastUpdated',
            ],
            available: [DESCRIPTORS.shortName],
        },
        filters: {
            default: ['dataDimensionType', 'categoryCombo'],
        },
    },
    indicator: {
        columns: {
            default: [
                DESCRIPTORS.name,
                'indicatorType',
                DESCRIPTORS.publicAccess,
                'lastUpdated',
            ],
            available: [DESCRIPTORS.shortName],
        },
        filters: {
            default: ['indicatorType'],
        },
    },
    indicatorType: {
        columns: {
            default: [
                DESCRIPTORS.name,
                { label: i18n.t('Factor'), path: 'factor' },
                'lastUpdated',
            ],
            available: [
                ...defaultAvailableColumnsNoSharing.filter(
                    (column) => column !== 'code'
                ),
                DESCRIPTORS.publicAccess,
            ],
            overrideDefaultAvailable: true,
        },
        filters: {
            default: [],
            available: [],
            overrideDefaultAvailable: true,
        },
    },
    indicatorGroup: {
        columns: {
            default: [
                DESCRIPTORS.name,
                DESCRIPTORS.publicAccess,
                'lastUpdated',
            ],
            available: [
                { label: i18n.t('Owner'), path: 'user.displayName' },
                'favorite',
            ],
        },
        filters: {
            default: [],
        },
    },
    indicatorGroupSet: {
        columns: {
            default: [
                DESCRIPTORS.name,
                'compulsory',
                DESCRIPTORS.publicAccess,
                'lastUpdated',
            ],
            available: [
                DESCRIPTORS.shortName,
                { label: i18n.t('Owner'), path: 'user.displayName' },
                'favorite',
            ],
        },
        filters: {
            default: [],
        },
    },
    categoryOptionGroupSet: {
        columns: {
            default: [
                DESCRIPTORS.name,
                'dataDimensionType',
                DESCRIPTORS.publicAccess,
                'lastUpdated',
            ],
            available: [DESCRIPTORS.shortName],
        },
        filters: {
            default: ['dataDimensionType'],
        },
    },
    categoryOptionGroup: {
        columns: {
            default: [
                DESCRIPTORS.name,
                'dataDimensionType',
                DESCRIPTORS.publicAccess,
                'lastUpdated',
            ],
            available: [DESCRIPTORS.shortName],
        },
        filters: {
            default: ['dataDimensionType'],
        },
    },
    categoryCombo: {
        columns: {
            default: [
                DESCRIPTORS.name,
                'dataDimensionType',
                DESCRIPTORS.publicAccess,
                'lastUpdated',
            ],
        },
        filters: {
            default: ['dataDimensionType', 'category'],
            available: ['ignoreApproval'],
        },
    },
    categoryOptionCombo: {
        columns: {
            default: [DESCRIPTORS.name, 'code', 'lastUpdated'],
            available: defaultAvailableColumnsNoSharing,
            // categoryOptionCombo does not have publicAccess
            overrideDefaultAvailable: true,
        },
        filters: {
            default: ['categoryOption', 'categoryCombo'],
            available: ['ignoreApproval'],
            // categoryOptionCombo does not have publicAccess
            overrideDefaultAvailable: true,
        },
    },
    programIndicatorGroup: {
        columns: {
            available: [
                { label: i18n.t('Owner'), path: 'user.displayName' },
                'favorite',
            ],
        },
        filters: {
            default: [],
            available: [],
            overrideDefaultAvailable: true,
        },
    },
    programIndicator: {
        columns: {
            default: [
                DESCRIPTORS.name,
                { label: i18n.t('Program name'), path: 'program.displayName' },
                'lastUpdated',
            ],
            available: [
                'expression',
                'displayInForm',
                'analyticsType',
                { label: i18n.t('Description'), path: 'displayDescription' },
                { label: i18n.t('Form name'), path: 'displayFormName' },
                { label: i18n.t('Short name'), path: 'displayShortName' },
                { label: i18n.t('Owner'), path: 'user.displayName' },
                { label: i18n.t('Decimals in data output'), path: 'decimals' },
                'favorite',
                'aggregationType',
                'code',
                'filter',
                'aggregateExportCategoryOptionCombo',
                'aggregateExportAttributeOptionCombo',
            ],
        },
        filters: {
            default: ['program'],
        },
    },
} satisfies SectionListViewConfig<SectionName>
