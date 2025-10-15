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
    formName: { label: i18n.t('Form name'), path: 'displayFormName' },
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
            available: [
                DESCRIPTORS.shortName,
                'zeroIsSignificant',
                DESCRIPTORS.formName,
            ],
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
            available: ['formName'],
            default: [
                'domainType',
                'valueType',
                'dataSet',
                'categoryCombo',
                'dataElementGroup',
            ],
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
            available: [
                DESCRIPTORS.shortName,
                DESCRIPTORS.formName,
                'categoryCombo',
            ],
        },
        filters: {
            available: ['categoryCombo', 'indicator'],
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
            default: ['dataSet'],
        },
    },
    organisationUnit: {
        columns: {
            available: [DESCRIPTORS.shortName, 'id'],
            default: [DESCRIPTORS.name, 'code', 'lastUpdated'],
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
            available: [DESCRIPTORS.shortName, 'id'],
            default: [DESCRIPTORS.name, 'code', 'lastUpdated'],
        },
        filters: {
            default: ['organisationUnitGroupSet'],
            overrideDefaultAvailable: true,
        },
    },
    organisationUnitGroupSet: {
        columns: {
            available: [DESCRIPTORS.shortName, 'id'],
            default: [DESCRIPTORS.name, 'code', 'lastUpdated'],
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
                DESCRIPTORS.formName,
            ],
            default: [
                DESCRIPTORS.name,
                DESCRIPTORS.publicAccess,
                'lastUpdated',
            ],
            overrideDefaultAvailable: true,
        },
        filters: {
            default: ['category', 'categoryOptionGroup', 'formName'],
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
    optionGroup: {
        columns: {
            available: [
                DESCRIPTORS.shortName,
                'description',
                'favorite',
                { label: i18n.t('Owner'), path: 'user.displayName' },
            ],
            default: [
                DESCRIPTORS.name,
                DESCRIPTORS.publicAccess,
                'lastUpdated',
            ],
        },
        filters: {
            default: [],
            available: [],
            overrideDefaultAvailable: true,
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
            default: ['indicatorType', 'indicatorGroup'],
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
                'indicatorGroupSet',
            ],
            available: [
                { label: i18n.t('Owner'), path: 'user.displayName' },
                'favorite',
            ],
        },
        filters: {
            default: ['indicator', 'indicatorGroupSet'],
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
            default: ['indicatorGroup'],
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
            default: ['dataDimensionType', 'categoryOptionGroupSet'],
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
            default: ['programIndicator'],
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
                'categoryCombo',
                { label: i18n.t('Description'), path: 'displayDescription' },
                DESCRIPTORS.formName,
                DESCRIPTORS.shortName,
                { label: i18n.t('Owner'), path: 'user.displayName' },
                { label: i18n.t('Decimals in data output'), path: 'decimals' },
                'favorite',
                'aggregationType',
                'code',
                'filter',
                'aggregateExportCategoryOptionCombo',
                'aggregateExportAttributeOptionCombo',
                'aggregateExportDataElement',
            ],
        },
        filters: {
            default: ['program', 'programIndicatorGroup'],
            available: ['categoryCombo'],
        },
    },
    optionGroupSet: {
        columns: {
            default: [
                DESCRIPTORS.name,
                DESCRIPTORS.publicAccess,
                'lastUpdated',
            ],
            available: [
                'dataDimension',
                { label: i18n.t('Option set'), path: 'optionSet.displayName' },
            ],
        },
        filters: {},
    },
    trackedEntityType: {
        columns: {
            default: [
                DESCRIPTORS.name,
                DESCRIPTORS.publicAccess,
                'lastUpdated',
            ],
            available: [
                'displayDescription',
                'allowAuditLog',
                'favorite',
                'featureType',
                DESCRIPTORS.formName,
                'maxTeiCountToReturn',
                'minAttributesRequiredToSearch',
                DESCRIPTORS.shortName,
                'user',
            ],
        },
        filters: {
            default: [],
            available: [],
            overrideDefaultAvailable: true,
        },
    },
    constant: {
        columns: {
            default: [
                DESCRIPTORS.name,
                { label: i18n.t('Value'), path: 'value' },
                'lastUpdated',
            ],
            available: [
                'description',
                DESCRIPTORS.formName,
                DESCRIPTORS.shortName,
                { label: i18n.t('Favorite'), path: 'favorite' },
                { label: i18n.t('Owner'), path: 'user.displayName' },
            ],
        },
        filters: {},
    },
    optionSet: {
        columns: {
            default: [
                DESCRIPTORS.name,
                DESCRIPTORS.publicAccess,
                { path: 'valueType', label: i18n.t('Value type') },
                'lastUpdated',
            ],
            available: [
                'href',
                'code',
                'id',
                { label: i18n.t('Favorite'), path: 'favorite' },
                { label: i18n.t('Version'), path: 'version' },
                { label: i18n.t('Owner'), path: 'user.displayName' },
            ],
        },
        filters: {},
    },
    attribute: {
        columns: {
            default: [
                DESCRIPTORS.name,
                { path: 'valueType', label: i18n.t('Value type') },
                { path: 'mandatory', label: i18n.t('Mandatory') },
                { path: 'unique', label: i18n.t('Unique') },
                DESCRIPTORS.publicAccess,
                'lastUpdated',
                { label: i18n.t('Option set'), path: 'optionSet.displayName' },
            ],
            available: [
                {
                    label: i18n.t('Category attribute'),
                    path: 'categoryAttribute',
                },
                {
                    label: i18n.t('Category option attribute'),
                    path: 'categoryOptionAttribute',
                },
                {
                    label: i18n.t('Category option combo attribute'),
                    path: 'categoryOptionComboAttribute',
                },
                {
                    label: i18n.t('Category option group attribute'),
                    path: 'categoryOptionGroupAttribute',
                },
                {
                    label: i18n.t('Category option group set attribute'),
                    path: 'categoryOptionGroupSetAttribute',
                },
                {
                    label: i18n.t('Constant attribute'),
                    path: 'constantAttribute',
                },
                {
                    label: i18n.t('Data element attribute'),
                    path: 'dataElementAttribute',
                },
                {
                    label: i18n.t('Data element group attribute'),
                    path: 'dataElementGroupAttribute',
                },
                {
                    label: i18n.t('Data element group set attribute'),
                    path: 'dataElementGroupSetAttribute',
                },
                {
                    label: i18n.t('Data set attribute'),
                    path: 'dataSetAttribute',
                },
                {
                    label: i18n.t('Document attribute'),
                    path: 'documentAttribute',
                },
                {
                    label: i18n.t('Event chart attribute'),
                    path: 'eventChartAttribute',
                },
                {
                    label: i18n.t('Event report attribute'),
                    path: 'eventReportAttribute',
                },
                {
                    label: i18n.t('Indicator attribute'),
                    path: 'indicatorAttribute',
                },
                {
                    label: i18n.t('Indicator group attribute'),
                    path: 'indicatorGroupAttribute',
                },
                {
                    label: i18n.t('Legend set attribute'),
                    path: 'legendSetAttribute',
                },
                { label: i18n.t('Map attribute'), path: 'mapAttribute' },
                { label: i18n.t('Option attribute'), path: 'optionAttribute' },
                {
                    label: i18n.t('Option set attribute'),
                    path: 'optionSetAttribute',
                },
                {
                    label: i18n.t('Organisation unit attribute'),
                    path: 'organisationUnitAttribute',
                },
                {
                    label: i18n.t('Organisation unit group attribute'),
                    path: 'organisationUnitGroupAttribute',
                },
                {
                    label: i18n.t('Organisation unit group set attribute'),
                    path: 'organisationUnitGroupSetAttribute',
                },
                {
                    label: i18n.t('Program attribute'),
                    path: 'programAttribute',
                },
                {
                    label: i18n.t('Program indicator attribute'),
                    path: 'programIndicatorAttribute',
                },
                {
                    label: i18n.t('Program stage attribute'),
                    path: 'programStageAttribute',
                },
                {
                    label: i18n.t('Relationship type attribute'),
                    path: 'relationshipTypeAttribute',
                },
                {
                    label: i18n.t('Section attribute'),
                    path: 'sectionAttribute',
                },
                {
                    label: i18n.t('SQL view attribute'),
                    path: 'sqlViewAttribute',
                },
                {
                    label: i18n.t('Tracked entity attribute attribute'),
                    path: 'trackedEntityAttributeAttribute',
                },
                {
                    label: i18n.t('Tracked entity type attribute'),
                    path: 'trackedEntityTypeAttribute',
                },
                { label: i18n.t('User attribute'), path: 'userAttribute' },
                {
                    label: i18n.t('User group attribute'),
                    path: 'userGroupAttribute',
                },
                {
                    label: i18n.t('Validation rule attribute'),
                    path: 'validationRuleAttribute',
                },
                {
                    label: i18n.t('Validation rule group attribute'),
                    path: 'validationRuleGroupAttribute',
                },
                {
                    label: i18n.t('Visualization attribute'),
                    path: 'visualizationAttribute',
                },
            ],
        },
        filters: {},
    },
    validationRule: {
        columns: {
            available: [],
        },
        filters: {
            default: ['validationRuleGroup'],
        },
    },
    validationRuleGroup: {
        columns: {
            default: [
                DESCRIPTORS.name,
                DESCRIPTORS.publicAccess,
                'lastUpdated',
            ],
            available: [
                { label: i18n.t('Favorite'), path: 'favorite' },
                { label: i18n.t('Owner'), path: 'user.displayName' },
            ],
        },
        filters: {},
    },
    validationNotificationTemplate: {
        columns: {
            available: [
                {
                    label: i18n.t('Notify users in hierarchy only'),
                    path: 'notifyUsersInHierarchyOnly',
                },
                {
                    label: i18n.t('Send notification as'),
                    path: 'sendStrategy',
                },
            ],
            default: [DESCRIPTORS.name, 'code', 'lastUpdated'],
        },
        filters: {
            default: [],
            overrideDefaultAvailable: true,
        },
    },
} satisfies SectionListViewConfig<SectionName>
