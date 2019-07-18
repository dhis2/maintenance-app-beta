export const sections = {
    category: {
        key: 'category',
        name: 'Category',
        sections: {
            categoryOption: {
                name: 'Category option',
                path: 'list/:section/categoryOption',
                description:
                    'Create, modify, view and delete data element category options. Category options are options with in category.',
                schemaName: 'categoryOption',
            },
            category: {
                name: 'Category',
                path: 'list/:section/category',
                description:
                    'Create, modify, view and delete data element categories. Categories are used for disaggregation of data elements.',
                schemaName: 'category',
            },
            categoryCombo: {
                name: 'Category combination',
                path: 'list/:section/categoryCombo',
                description:
                    'msgid "Create, modify, view and delete data element category combinations.',
                schemaName: 'categoryCombo',
            },
            categoryOptionCombo: {
                name: 'Category option combination',
                path: 'list/:section/categoryOptionCombo',
                description:
                    'View and edit data element category option combinations. Category option combinations are break-downs of category.',
                schemaName: 'categoryOptionCombo',
            },
            categoryOptionGroup: {
                name: 'Category option group',
                path: 'list/:section/categoryOptionGroup',
                description:
                    'Create, modify, view and delete category option groups, which can be used to classify category options.',
                schemaName: 'categoryOptionGroup',
            },
            categoryOptionGroupSet: {
                name: 'Category option group set',
                path: 'list/:section/categoryOptionGroupSet',
                description:
                    'Create, modify, view and delete category option group sets, which can be used for improved data analysis.',
                schemaName: 'categoryOptionGroupSet',
            },
        },
    },
    dataElement: {
        key: 'dataElement',
        name: 'Data element',
        sections: {
            dataElement: {
                name: 'Data elements',
                path: 'list/:section/dataElement',
                description:
                    'Create, modify, view and delete data elements. Data elements are phenomena for which will be captured and analyzed.',
                schemaName: 'dataElement',
            },
            dataElementGroup: {
                name: 'Data element group',
                path: 'list/:section/dataElementGroup',
                description:
                    'Create, modify, view and delete data element groups. Groups are used for improved analysis.',
                schemaName: 'dataElementGroup',
            },
            dataElementGroupSet: {
                name: 'Data element group set',
                path: 'list/:section/dataElementGroupSet',
                description:
                    'Create, modify, view and delete data element group sets. Group sets are used for improved analysis.',
                schemaName: 'dataElementGroupSet',
            },
        },
    },
    dataSet: {
        key: 'dataSet',
        name: 'Data set',
        sections: {
            dataSet: {
                name: 'Data set',
                path: 'list/:section/dataSet',
                description:
                    'Create, update, view and delete data sets and custom forms. A data set is a collection of data elements for which data is entered.',
                schemaName: 'dataSet',
            },
            dataSetNotification: {
                name: 'Data set notifications',
                path: 'list/:section/dataSetNotificationTemplate',
                description:
                    'Create, update, view, and delete data set notifications.',
                schemaName: 'dataSetNotificationTemplate',
            },
        },
    },
    indicator: {
        key: 'indicator',
        name: 'Indicator',
        sections: {
            indicator: {
                name: 'Indicator',
                path: 'list/:section/indicator',
                description:
                    'Create, modify, view and delete indicators. An indicator is a formula consisting of data elements and numbers.',
                schemaName: 'indicator',
            },
            indicatorType: {
                name: 'Indicator type',
                path: 'list/:section/indicatorType',
                description:
                    'Create, modify, view and delete indicator types. An indicator type is a factor for an indicator, like percentage.',
                schemaName: 'indicatorType',
            },
            indicatorGroup: {
                name: 'Indicator group',
                path: 'list/:section/indicatorGroup',
                description:
                    'Create, modify, view and delete indicator groups. Groups are used for improved analysis.',
                schemaName: 'indicatorGroup',
            },
            indicatorGroupSet: {
                name: 'Indicator group set',
                path: 'list/:section/indicatorGroupSet',
                description:
                    'Create, modify, view and delete indicator group sets. Group sets are used for improved analysis.',
                schemaName: 'indicatorGroupSet',
            },
            programIndicator: {
                name: 'Program indicator',
                path: 'list/:section/programIndicator',
                description:
                    'Expressions based on data elements and attributes of tracked entities. You use program indicators to calculate values based on a formula.',
                schemaName: 'programIndicator',
            },
            programIndicatorGroup: {
                name: 'Program indicator group',
                path: 'list/:section/programIndicatorGroup',
                description: 'Group program indicators, even across programs.',
                schemaName: 'programIndicatorGroup',
            },
        },
    },
    organisationUnit: {
        key: 'organisationUnit',
        name: 'Organisation unit',
        sections: {
            organisationUnit: {
                name: 'Organisation unit',
                path: 'list/:section/organisationUnit',
                description:
                    'Create, modify, view and delete organisation units, which can be departments, offices, hospitals and clinics.',
                schemaName: 'organisationUnit',
            },
            organisationUnitGroup: {
                name: 'Organisation unit group',
                path: 'list/:section/organisationUnitGroup',
                description:
                    'Create, modify, view and delete organisation unit groups. Groups are used for improved analysis.',
                schemaName: 'organisationUnitGroup',
            },
            organisationUnitGroupSet: {
                name: 'Organisation unit group set',
                path: 'list/:section/organisationUnitGroupSet',
                description:
                    'Create, modify, view and delete organisation unit group sets. Group sets are used for improved analysis.',
                schemaName: 'organisationUnitGroupSet',
            },
            organisationUnitLevel: {
                name: 'Organisation unit level',
                path: 'list/:section/organisationUnitLevel',
                description:
                    'Create, modify, view and delete descriptive names for the organisation unit levels in the system.',
                schemaName: 'organisationUnitLevel',
            },
            hierarchyOption: {
                name: 'Hierarchy options',
                path: 'list/:section/hierarchy',
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
        sections: {
            program: {
                name: 'Program',
                path: 'list/:section/program',
                description:
                    '"Create modify and view programs. A program has program stages and defines which actions should be taken at each stage.',
                schemaName: 'program',
            },
            trackedEntityAttribute: {
                name: 'Tracked entity attribute',
                path: 'list/:section/trackedEntityAttribute',
                description:
                    'Create, modify and view program attributes. A program can have any number of attributes.',
                schemaName: 'trackedEntityAttribute',
            },
            trackedEntityType: {
                name: 'Tracked entity type',
                path: 'list/:section/trackedEntityType',
                description:
                    'Define types of entities which can be tracked through the system, which can be anything from persons to commodities.',
                schemaName: 'trackedEntityType',
            },
            relationshipType: {
                name: 'Relationship type',
                path: 'list/:section/relationshipType',
                description:
                    'Create, modify and view relationship types. A relationship is typically wife and husband or mother and child.',
                schemaName: 'relationshipType',
            },
            programRule: {
                name: 'Program rule',
                path: 'list/:section/programRule',
                description:
                    'Program rules allow you to create and control dynamic behavior of the user interface in the Tracker Capture and Event Capture apps.',
                schemaName: 'programRule',
            },
            programRuleVariable: {
                name: 'Program rule variable',
                path: 'list/:section/programRuleVariable',
                description:
                    'Variables you use to create program rule expressions.',
                schemaName: 'programRuleVariable',
            },
        },
    },
    validation: {
        key: 'validation',
        name: 'Validation',
        sections: {
            validationRule: {
                name: 'Validation rule',
                path: '/list/validationSectin/validationRule',
                description:
                    'Add, modify, view and delete validation rules. Anomalies can be discovered by running validation rules against the data.',
                schemaName: 'validationRule',
            },
            validationRuleGroup: {
                name: 'Validation rule group',
                path: '/list/validationSectin/validationRuleGroup',
                description:
                    'Add, modify, view and delete validation rule groups. Provides the ability to group and run validation rules together.',
                schemaName: 'validationRuleGroup',
            },
            validationNotification: {
                name: 'Validation notification',
                path: '/list/validationSectin/validationNotification',
                description:
                    'Sends a notification when a validation rule failed',
                schemaName: 'validationNotificationTemplate', // @TODO
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
        sections: {
            constant: {
                name: 'Constant',
                path: 'list/:section/constant',
                description:
                    'Create constants which can be included in expressions of indicator and validation rules.',
                schemaName: 'constant',
            },
            attribute: {
                name: 'Attribute',
                path: 'list/:section/attribute',
                description: 'Create, modify and view attributes.',
                schemaName: 'attribute',
            },
            optionSet: {
                name: 'Option set',
                path: 'list/:section/optionSet',
                description:
                    'Create option sets which can be included in data elements and produce drop-down lists in data entry forms.',
                schemaName: 'optionSet',
            },
            optionGroup: {
                name: 'Option group',
                path: 'list/:section/optionGroup',
                description:
                    'Create a group of options from option sets that has a similar functional area or meaning.',
                schemaName: 'optionGroup',
            },
            optionGroupSet: {
                name: 'Option group set',
                path: 'list/:section/optionGroupSet',
                description: 'Create, modify and view sets of option groups.',
                schemaName: 'optionGroupSet',
            },
            legend: {
                name: 'Legend',
                path: 'list/:section/legend',
                description:
                    'Create, modify and view predefined legends for maps and other visualisations.',
                schemaName: 'legend',
            },
            predictor: {
                name: 'Predictor',
                path: 'list/:section/predictor',
                description:
                    'Create predictors which can be used to predict future data values.',
                schemaName: 'predictor',
            },
            predictorGroup: {
                name: 'Predictor group',
                path: 'list/:section/predictorGroup',
                description:
                    'Create predictors groups that contain serveral predictors related predictors.',
                schemaName: 'predictorGroup',
            },
            pushAnalysis: {
                name: 'Push analysis',
                path: 'list/:section/pushAnalysis',
                description:
                    'Manage analytics to be emailed to specific user groups on a daily, weekly or monthly basis.',
                schemaName: 'pushAnalysis',
            },
            externalMapLayer: {
                name: 'External map layer',
                path: 'list/:section/externalMapLayer',
                description: 'Configure external map layers for use in GIS.',
                schemaName: 'externalMapLayer',
            },
            dataApprovalLevel: {
                name: 'Data approval level',
                path: 'list/:section/dataApprovalLevel',
                description:
                    'Configure data approval levels for use in data approval workflows',
                schemaName: 'dataApprovalLevel',
            },
            dataApprovalWorkflow: {
                name: 'Data approval workflow',
                path: 'list/:section/dataApprovalWorkflow',
                description: '',
                schemaName: 'dataApprovalWorkflow',
            },
            locale: {
                name: 'Locale',
                path: 'list/:section/locale',
                description:
                    'Create and manage locales for database content. A locale is a combination of language and country.',
                schemaName: 'locale', // @TODO
            },
            sqlView: {
                name: 'SQL View',
                path: 'list/:section/sqlView',
                description:
                    'Create SQL database views. These views will typically use the resource tables to provide convenient views for third-party tools.',
                schemaName: 'sqlView',
            },
        },
    },
}
