export const sections = {
    category: {
        key: 'category',
        name: 'Category',
        path: '/list/categorySection',
        sections: {
            categoryOption: {
                name: 'Category option',
                path: '/list/categorySection/categoryOption',
                description:
                    'Create, modify, view and delete data element category options. Category options are options with in category.',
                permissions: [
                    'F_CATEGORY_OPTION_PRIVATE_ADD',
                    'F_CATEGORY_OPTION_PUBLIC_ADD',
                    'F_CATEGORY_OPTION_DELETE',
                ],
            },
            category: {
                name: 'Category',
                path: '/list/categorySection/category',
                description:
                    'Create, modify, view and delete data element categories. Categories are used for disaggregation of data elements.',
                permissions: [
                    'F_CATEGORY_PRIVATE_ADD',
                    'F_CATEGORY_PUBLIC_ADD',
                    'F_CATEGORY_DELETE',
                ],
            },
            categoryCombo: {
                name: 'Category combination',
                path: '/list/categorySection/categoryCombo',
                description:
                    'msgid "Create, modify, view and delete data element category combinations.',
                permissions: [
                    'F_CATEGORY_COMBO_PRIVATE_ADD',
                    'F_CATEGORY_COMBO_PUBLIC_ADD',
                    'F_CATEGORY_COMBO_DELETE',
                ],
            },
            categoryOptionCombo: {
                name: 'Category option combination',
                path: '/list/categorySection/categoryOptionCombo',
                description:
                    'View and edit data element category option combinations. Category option combinations are break-downs of category.',
                permissions: [
                    'F_CATEGORY_OPTION_COMBO_PRIVATE_ADD',
                    'F_CATEGORY_OPTION_COMBO_PUBLIC_ADD',
                    'F_CATEGORY_OPTION_COMBO_DELETE',
                ],
            },
            categoryOptionGroup: {
                name: 'Category option group',
                path: '/list/categorySection/categoryOptionGroup',
                description:
                    'Create, modify, view and delete category option groups, which can be used to classify category options.',
                permissions: [
                    'F_CATEGORY_OPTION_GROUP_PRIVATE_ADD',
                    'F_CATEGORY_OPTION_GROUP_PUBLIC_ADD',
                    'F_CATEGORY_OPTION_GROUP_DELETE',
                ],
            },
            categoryOptionGroupSet: {
                name: 'Category option group set',
                path: '/list/categorySection/categoryOptionGroupSet',
                description:
                    'Create, modify, view and delete category option group sets, which can be used for improved data analysis.',
                permissions: [
                    'F_CATEGORY_OPTION_GROU_SET_PRIVATE_ADD',
                    'F_CATEGORY_OPTION_GROU_SET_PUBLIC_ADD',
                    'F_CATEGORY_OPTION_GROU_SET_DELETE',
                ],
            },
        },
    },
    dataElement: {
        key: 'dataElement',
        name: 'Data element',
        path: '/list/dataElementSection',
        sections: {
            dataElement: {
                name: 'Data elements',
                path: '/list/dataElementSection/dataElement',
                description:
                    'Create, modify, view and delete data elements. Data elements are phenomena for which will be captured and analyzed.',
                permissions: [
                    'F_DATAELEMENT_PRIVATE_ADD',
                    'F_DATAELEMENT_PUBLIC_ADD',
                    'F_DATAELEMENT_DELETE',
                ],
            },
            dataElementGroup: {
                name: 'Data element group',
                path: '/list/dataElementSection/dataElementGroup',
                description:
                    'Create, modify, view and delete data element groups. Groups are used for improved analysis.',
                permissions: [
                    'F_DATAELEMENTGROUP_PRIVATE_ADD',
                    'F_DATAELEMENTGROUP_PUBLIC_ADD',
                    'F_DATAELEMENTGROUP_DELETE',
                ],
            },
            dataElementGroupSet: {
                name: 'Data element group set',
                path: '/list/dataElementSection/dataElementGroupSet',
                description:
                    'Create, modify, view and delete data element group sets. Group sets are used for improved analysis.',
                permissions: [
                    'F_DATAELEMENTGROUPSET_PRIVATE_ADD',
                    'F_DATAELEMENTGROUPSET_PUBLIC_ADD',
                    'F_DATAELEMENTGROUPSET_DELETE',
                ],
            },
        },
    },
    dataSet: {
        key: 'dataSet',
        name: 'Data set',
        path: '/list/dataSetSection',
        sections: {
            dataSet: {
                name: 'Data set',
                path: '/list/dataSetSection/dataSet',
                description:
                    'Create, update, view and delete data sets and custom forms. A data set is a collection of data elements for which data is entered.',
                permissions: [
                    'F_DATA_SET_PRIVATE_ADD',
                    'F_DATA_SET_PUBLIC_ADD',
                    'F_DATA_SET_DELETE',
                ],
            },
            dataSetNotification: {
                name: 'Data set notifications',
                path: '/list/dataSetSection/dataSetNotificationTemplate',
                description:
                    'Create, update, view, and delete data set notifications.',
                permissions: [
                    'F_DATA_SET_NOTIFICATIONS_PRIVATE_ADD',
                    'F_DATA_SET_NOTIFICATIONS_PUBLIC_ADD',
                    'F_DATA_SET_NOTIFICATIONS_DELETE',
                ],
            },
        },
    },
    indicator: {
        key: 'indicator',
        name: 'Indicator',
        path: '/list/indicatorSection',
        sections: {
            indicator: {
                name: 'Indicator',
                path: '/list/indicatorSection/indicator',
                description:
                    'Create, modify, view and delete indicators. An indicator is a formula consisting of data elements and numbers.',
                permissions: [
                    'F_INDICATOR_PRIVATE_ADD',
                    'F_INDICATOR_PUBLIC_ADD',
                    'F_INDICATOR_DELETE',
                ],
            },
            indicatorType: {
                name: 'Indicator type',
                path: '/list/indicatorSection/indicatorType',
                description:
                    'Create, modify, view and delete indicator types. An indicator type is a factor for an indicator, like percentage.',
                permissions: [
                    'F_INDICATOR_TYPE_PRIVATE_ADD',
                    'F_INDICATOR_TYPE_PUBLIC_ADD',
                    'F_INDICATOR_TYPE_DELETE',
                ],
            },
            indicatorGroup: {
                name: 'Indicator group',
                path: '/list/indicatorSection/indicatorGroup',
                description:
                    'Create, modify, view and delete indicator groups. Groups are used for improved analysis.',
                permissions: [
                    'F_INDICATOR_GROUP_PRIVATE_ADD',
                    'F_INDICATOR_GROUP_PUBLIC_ADD',
                    'F_INDICATOR_GROUP_DELETE',
                ],
            },
            indicatorGroupSet: {
                name: 'Indicator group set',
                path: '/list/indicatorSection/indicatorGroupSet',
                description:
                    'Create, modify, view and delete indicator group sets. Group sets are used for improved analysis.',
                permissions: [
                    'F_INDICATOR_GROUP_SET_PRIVATE_ADD',
                    'F_INDICATOR_GROUP_SET_PUBLIC_ADD',
                    'F_INDICATOR_GROUP_SET_DELETE',
                ],
            },
            programIndicator: {
                name: 'Program indicator',
                path: '/list/indicatorSection/programIndicator',
                description:
                    'Expressions based on data elements and attributes of tracked entities. You use program indicators to calculate values based on a formula.',
                permissions: [
                    'F_PROGRAM_INDICATOR_PRIVATE_ADD',
                    'F_PROGRAM_INDICATOR_PUBLIC_ADD',
                    'F_PROGRAM_INDICATOR_DELETE',
                ],
            },
            programIndicatorGroup: {
                name: 'Program indicator group',
                path: '/list/indicatorSection/programIndicatorGroup',
                description: 'Group program indicators, even across programs.',
                permissions: [
                    'F_PROGAM_INDICATOR_GROUP_PRIVATE_ADD',
                    'F_PROGAM_INDICATOR_GROUP_PUBLIC_ADD',
                    'F_PROGAM_INDICATOR_GROUP_DELETE',
                ],
            },
        },
    },
    organisationUnit: {
        key: 'organisationUnit',
        name: 'Organisation unit',
        path: '/list/organisationUnitSection',
        sections: {
            organisationUnit: {
                name: 'Organisation unit',
                path: '/list/organisationUnitSection/organisationUnit',
                description:
                    'Create, modify, view and delete organisation units, which can be departments, offices, hospitals and clinics.',
                permissions: [
                    'F_ORGANISATION_UNIT_PRIVATE_ADD',
                    'F_ORGANISATION_UNIT_PUBLIC_ADD',
                    'F_ORGANISATION_UNIT_DELETE',
                ],
            },
            organisationUnitGroup: {
                name: 'Organisation unit group',
                path: '/list/organisationUnitSection/organisationUnitGroup',
                description:
                    'Create, modify, view and delete organisation unit groups. Groups are used for improved analysis.',
                permissions: [
                    'F_ORGANISATION_UNIT_GROUP_PRIVATE_ADD',
                    'F_ORGANISATION_UNIT_GROUP_PUBLIC_ADD',
                    'F_ORGANISATION_UNIT_GROUP_DELETE',
                ],
            },
            organisationUnitGroupSet: {
                name: 'Organisation unit group set',
                path: '/list/organisationUnitSection/organisationUnitGroupSet',
                description:
                    'Create, modify, view and delete organisation unit group sets. Group sets are used for improved analysis.',
                permissions: [
                    'F_ORGANISATION_UNIT_GROUP_SET_PRIVATE_ADD',
                    'F_ORGANISATION_UNIT_GROUP_SET_PUBLIC_ADD',
                    'F_ORGANISATION_UNIT_GROUP_SET_DELETE',
                ],
            },
            organisationUnitLevel: {
                name: 'Organisation unit level',
                path: '/list/organisationUnitSection/organisationUnitLevel',
                description:
                    'Create, modify, view and delete descriptive names for the organisation unit levels in the system.',
                permissions: [
                    'F_ORGANISATION_UNIT_LEVEL_PRIVATE_ADD',
                    'F_ORGANISATION_UNIT_LEVEL_PUBLIC_ADD',
                    'F_ORGANISATION_UNIT_LEVEL_DELETE',
                ],
            },
            hierarchyOption: {
                name: 'Hierarchy options',
                path: '/list/orgnaisationUnitSection/hierarchy',
                description: '',
                permissions: [
                    'F_HIERARCHY_OPTIONS_PRIVATE_ADD',
                    'F_HIERARCHY_OPTIONS_PUBLIC_ADD',
                    'F_HIERARCHY_OPTIONS_DELETE',
                ],
            },
        },
    },
    program: {
        key: 'program',
        name: 'Program',
        path: '/list/programSection',
        sections: {
            program: {
                name: 'Program',
                path: '/list/programSection/program',
                description:
                    '"Create modify and view programs. A program has program stages and defines which actions should be taken at each stage.',
                permissions: [
                    'F_PROGRAM_PRIVATE_ADD',
                    'F_PROGRAM_PUBLICE_ADD',
                    'F_PROGRAM_DELETE',
                ],
            },
            trackedEntityAttribute: {
                name: 'Tracked entity attribute',
                path: '/list/programSection/tackedEntityAttribute',
                description:
                    'Create, modify and view program attributes. A program can have any number of attributes.',
                permissions: [
                    'F_TRACKED_ENTITY_ATTRIBUTE_PRIVATE_ADD',
                    'F_TRACKED_ENTITY_ATTRIBUTE_PUBLICE_ADD',
                    'F_TRACKED_ENTITY_ATTRIBUTE_DELETE',
                ],
            },
            trackedEntityType: {
                name: 'Tracked entity type',
                path: '/list/programSection/tackedEntityType',
                description:
                    'Define types of entities which can be tracked through the system, which can be anything from persons to commodities.',
                permissions: [
                    'F_TRACKED_ENTITY_TYPE_PRIVATE_ADD',
                    'F_TRACKED_ENTITY_TYPE_PUBLICE_ADD',
                    'F_TRACKED_ENTITY_TYPE_DELETE',
                ],
            },
            relationshipType: {
                name: 'Relationship type',
                path: '/list/programSection/relationshipType',
                description:
                    'Create, modify and view relationship types. A relationship is typically wife and husband or mother and child.',
                permissions: [
                    'F_RELATIONSHIP_TYPE_PRIVATE_ADD',
                    'F_RELATIONSHIP_TYPE_PUBLICE_ADD',
                    'F_RELATIONSHIP_TYPE_DELETE',
                ],
            },
            programRule: {
                name: 'Program rule',
                path: '/list/programSection/programRule',
                description:
                    'Program rules allow you to create and control dynamic behavior of the user interface in the Tracker Capture and Event Capture apps.',
                permissions: [
                    'F_PROGRAM_RULE_PRIVATE_ADD',
                    'F_PROGRAM_RULE_PUBLICE_ADD',
                    'F_PROGRAM_RULE_DELETE',
                ],
            },
            programRuleVariable: {
                name: 'Program rule variable',
                path: '/list/programSection/programRuleVariable',
                description:
                    'Variables you use to create program rule expressions.',
                permissions: [
                    'F_PROGRAM_RULE_VARIABLE_PRIVATE_ADD',
                    'F_PROGRAM_RULE_VARIABLE_PUBLICE_ADD',
                    'F_PROGRAM_RULE_VARIABLE_DELETE',
                ],
            },
        },
    },
    validation: {
        key: 'validation',
        name: 'Validation',
        path: '/list/validationSection',
        sections: {
            validationRule: {
                name: 'Validation rule',
                path: '/list/validationSectin/validationRule',
                description:
                    'Add, modify, view and delete validation rules. Anomalies can be discovered by running validation rules against the data.',
                permissions: [
                    'F_VALIDATION_RULE_PRIVATE_ADD',
                    'F_VALIDATION_RULE_PUBLICE_ADD',
                    'F_VALIDATION_RULE_DELETE',
                ],
            },
            validationRuleGroup: {
                name: 'Validation rule group',
                path: '/list/validationSectin/validationRuleGroup',
                description:
                    'Add, modify, view and delete validation rule groups. Provides the ability to group and run validation rules together.',
                permissions: [
                    'F_VALIDATION_RULE_GROUP_PRIVATE_ADD',
                    'F_VALIDATION_RULE_GROUP_PUBLICE_ADD',
                    'F_VALIDATION_RULE_GROUP_DELETE',
                ],
            },
            validationNotification: {
                name: 'Validation notification',
                path: '/list/validationSectin/validationNotification',
                description:
                    'Sends a notification when a validation rule failed',
                permissions: [
                    'F_VALIDATION_NOTIFICATION_PRIVATE_ADD',
                    'F_VALIDATION_NOTIFICATION_PUBLICE_ADD',
                    'F_VALIDATION_NOTIFICATION_DELETE',
                ],
            },
        },
    },
    other: {
        key: 'other',
        name: 'Other',
        path: '/list/otherSection',
        sections: {
            constant: {
                name: 'Constant',
                description:
                    'Create constants which can be included in expressions of indicator and validation rules.',
                path: '/list/otherSection/constant',
                permissions: [
                    'F_CONSTANT_PRIVATE_ADD',
                    'F_CONSTANT_PUBLICE_ADD',
                    'F_CONSTANT_DELETE',
                ],
            },
            attribute: {
                name: 'Attribute',
                path: '/list/otherSection/attribute',
                description: 'Create, modify and view attributes.',
                permissions: [
                    'F_ATTRIBUTE_PRIVATE_ADD',
                    'F_ATTRIBUTE_PUBLICE_ADD',
                    'F_ATTRIBUTE_DELETE',
                ],
            },
            optionSet: {
                name: 'Option set',
                path: '/list/otherSection/optionSet',
                description:
                    'Create option sets which can be included in data elements and produce drop-down lists in data entry forms.',
                permissions: [
                    'F_OPTION_SET_PRIVATE_ADD',
                    'F_OPTION_SET_PUBLICE_ADD',
                    'F_OPTION_SET_DELETE',
                ],
            },
            optionGroup: {
                name: 'Option group',
                path: '/list/otherSection/optionGroup',
                description:
                    'Create a group of options from option sets that has a similar functional area or meaning.',
                permissions: [
                    'F_OPTION_GROUP_PRIVATE_ADD',
                    'F_OPTION_GROUP_PUBLICE_ADD',
                    'F_OPTION_GROUP_DELETE',
                ],
            },
            optionGroupSet: {
                name: 'Option group set',
                path: '/list/otherSection/optionGroupSet',
                description: 'Create, modify and view sets of option groups.',
                permissions: [
                    'F_OPTION_GROUP_SET_PRIVATE_ADD',
                    'F_OPTION_GROUP_SET_PUBLICE_ADD',
                    'F_OPTION_GROUP_SET_DELETE',
                ],
            },
            legend: {
                name: 'Legend',
                path: '/list/otherSection/legend',
                description:
                    'Create, modify and view predefined legends for maps and other visualisations.',
                permissions: [
                    'F_LEGEND_PRIVATE_ADD',
                    'F_LEGEND_PUBLICE_ADD',
                    'F_LEGEND_DELETE',
                ],
            },
            predictor: {
                name: 'Predictor',
                path: '/list/otherSection/predictor',
                description:
                    'Create predictors which can be used to predict future data values.',
                permissions: [
                    'F_PREDICTOR_PRIVATE_ADD',
                    'F_PREDICTOR_PUBLICE_ADD',
                    'F_PREDICTOR_DELETE',
                ],
            },
            predictorGroup: {
                name: 'Predictor group',
                path: '/list/otherSection/predictorGroup',
                description:
                    'Create predictors groups that contain serveral predictors related predictors.',
                permissions: [
                    'F_PREDICTOR_GROUP_PRIVATE_ADD',
                    'F_PREDICTOR_GROUP_PUBLICE_ADD',
                    'F_PREDICTOR_GROUP_DELETE',
                ],
            },
            pushAnalysis: {
                name: 'Push analysis',
                path: '/list/otherSection/pushAnalysis',
                description:
                    'Manage analytics to be emailed to specific user groups on a daily, weekly or monthly basis.',
                permissions: [
                    'F_PUSH_ANALYSIS_PRIVATE_ADD',
                    'F_PUSH_ANALYSIS_PUBLICE_ADD',
                    'F_PUSH_ANALYSIS_DELETE',
                ],
            },
            externalMapLayer: {
                name: 'External map layer',
                path: '/list/otherSection/externalMapLayer',
                description: 'Configure external map layers for use in GIS.',
                permissions: [
                    'F_EXTERNAL_MAP_LAYER_PRIVATE_ADD',
                    'F_EXTERNAL_MAP_LAYER_PUBLICE_ADD',
                    'F_EXTERNAL_MAP_LAYER_DELETE',
                ],
            },
            dataApprovalLevel: {
                name: 'Data approval level',
                path: '/list/otherSection/dataApprovalLevel',
                description:
                    'Configure data approval levels for use in data approval workflows',
                permissions: [
                    'F_DATA_APPROVAL_LEVEL_PRIVATE_ADD',
                    'F_DATA_APPROVAL_LEVEL_PUBLICE_ADD',
                    'F_DATA_APPROVAL_LEVEL_DELETE',
                ],
            },
            dataApprovalWorkflow: {
                name: 'Data approval workflow',
                path: '/list/otherSection/dataApprovalWorkflow',
                description: '',
                permissions: [
                    'F_DATA_APPROVAL_WORKFLOW_PRIVATE_ADD',
                    'F_DATA_APPROVAL_WORKFLOW_PUBLICE_ADD',
                    'F_DATA_APPROVAL_WORKFLOW_DELETE',
                ],
            },
            locale: {
                name: 'Locale',
                path: '/list/otherSection/locale',
                description:
                    'Create and manage locales for database content. A locale is a combination of language and country.',
                permissions: [
                    'F_LOCALE_PRIVATE_ADD',
                    'F_LOCALE_PUBLICE_ADD',
                    'F_LOCALE_DELETE',
                ],
            },
            sqlView: {
                name: 'SQL View',
                path: '/list/otherSection/sqlView',
                description:
                    'Create SQL database views. These views will typically use the resource tables to provide convenient views for third-party tools.',
                permissions: [
                    'F_SQL_VIEW_PRIVATE_ADD',
                    'F_SQL_VIEW_PUBLICE_ADD',
                    'F_SQL_VIEW_DELETE',
                ],
            },
        },
    },
}
