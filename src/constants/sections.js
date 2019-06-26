export const sections = {
    category: {
        name: 'Category',
        path: '/list/categorySection',
        sections: {
            categoryOption: {
                name: 'Category option',
                path: '/list/categorySection/categoryOption',
                permissions: [
                    'F_CATEGORY_OPTION_PRIVATE_ADD',
                    'F_CATEGORY_OPTION_PUBLIC_ADD',
                    'F_CATEGORY_OPTION_DELETE',
                ],
            },
            category: {
                name: 'Category',
                path: '/list/categorySection/category',
                permissions: [
                    'F_CATEGORY_PRIVATE_ADD',
                    'F_CATEGORY_PUBLIC_ADD',
                    'F_CATEGORY_DELETE',
                ],
            },
            categoryCombo: {
                name: 'Category combination',
                path: '/list/categorySection/categoryCombo',
                permissions: [
                    'F_CATEGORY_COMBO_PRIVATE_ADD',
                    'F_CATEGORY_COMBO_PUBLIC_ADD',
                    'F_CATEGORY_COMBO_DELETE',
                ],
            },
            categoryOptionCombo: {
                name: 'Category option combination',
                path: '/list/categorySection/categoryOptionCombo',
                permissions: [
                    'F_CATEGORY_OPTION_COMBO_PRIVATE_ADD',
                    'F_CATEGORY_OPTION_COMBO_PUBLIC_ADD',
                    'F_CATEGORY_OPTION_COMBO_DELETE',
                ],
            },
            categoryOptionGroup: {
                name: 'Category option group',
                path: '/list/categorySection/categoryOptionGroup',
                permissions: [
                    'F_CATEGORY_OPTION_GROUP_PRIVATE_ADD',
                    'F_CATEGORY_OPTION_GROUP_PUBLIC_ADD',
                    'F_CATEGORY_OPTION_GROUP_DELETE',
                ],
            },
            categoryOptionGroupSet: {
                name: 'Category option group set',
                path: '/list/categorySection/categoryOptionGroupSet',
                permissions: [
                    'F_CATEGORY_OPTION_GROU_SET_PRIVATE_ADD',
                    'F_CATEGORY_OPTION_GROU_SET_PUBLIC_ADD',
                    'F_CATEGORY_OPTION_GROU_SET_DELETE',
                ],
            },
        },
    },
    dataElement: {
        name: 'Data element',
        path: '/list/dataElementSection',
        sections: {
            dataElement: {
                name: 'Data elements',
                path: '/list/dataElementSection/dataElement',
                permissions: [
                    'F_DATAELEMENT_PRIVATE_ADD',
                    'F_DATAELEMENT_PUBLIC_ADD',
                    'F_DATAELEMENT_DELETE',
                ],
            },
            dataElementGroup: {
                name: 'Data element group',
                path: '/list/dataElementSection/dataElementGroup',
                permissions: [
                    'F_DATAELEMENTGROUP_PRIVATE_ADD',
                    'F_DATAELEMENTGROUP_PUBLIC_ADD',
                    'F_DATAELEMENTGROUP_DELETE',
                ],
            },
            dataElementGroupSet: {
                name: 'Data element group set',
                path: '/list/dataElementSection/dataElementGroupSet',
                permissions: [
                    'F_DATAELEMENTGROUPSET_PRIVATE_ADD',
                    'F_DATAELEMENTGROUPSET_PUBLIC_ADD',
                    'F_DATAELEMENTGROUPSET_DELETE',
                ],
            },
        },
    },
    dataSet: {
        name: 'Data set',
        path: '/list/dataSetSection',
        sections: {
            dataSet: {
                name: 'Data set',
                path: '/list/dataSetSection/dataSet',
                permissions: [
                    'F_DATA_SET_PRIVATE_ADD',
                    'F_DATA_SET_PUBLIC_ADD',
                    'F_DATA_SET_DELETE',
                ],
            },
            dataSetNotification: {
                name: 'Data set notifications',
                path: '/list/dataSetSection/dataSetNotificationTemplate',
                permissions: [
                    'F_DATA_SET_NOTIFICATIONS_PRIVATE_ADD',
                    'F_DATA_SET_NOTIFICATIONS_PUBLIC_ADD',
                    'F_DATA_SET_NOTIFICATIONS_DELETE',
                ],
            },
        },
    },
    indicator: {
        name: 'Indicator',
        path: '/list/indicatorSection',
        sections: {
            indicator: {
                name: 'Indicator',
                path: '/list/indicatorSection/indicator',
                permissions: [
                    'F_INDICATOR_PRIVATE_ADD',
                    'F_INDICATOR_PUBLIC_ADD',
                    'F_INDICATOR_DELETE',
                ],
            },
            indicatorType: {
                name: 'Indicator type',
                path: '/list/indicatorSection/indicatorType',
                permissions: [
                    'F_INDICATOR_TYPE_PRIVATE_ADD',
                    'F_INDICATOR_TYPE_PUBLIC_ADD',
                    'F_INDICATOR_TYPE_DELETE',
                ],
            },
            indicatorGroup: {
                name: 'Indicator group',
                path: '/list/indicatorSection/indicatorGroup',
                permissions: [
                    'F_INDICATOR_GROUP_PRIVATE_ADD',
                    'F_INDICATOR_GROUP_PUBLIC_ADD',
                    'F_INDICATOR_GROUP_DELETE',
                ],
            },
            indicatorGroupSet: {
                name: 'Indicator group set',
                path: '/list/indicatorSection/indicatorGroupSet',
                permissions: [
                    'F_INDICATOR_GROUP_SET_PRIVATE_ADD',
                    'F_INDICATOR_GROUP_SET_PUBLIC_ADD',
                    'F_INDICATOR_GROUP_SET_DELETE',
                ],
            },
            programIndicator: {
                name: 'Program indicator',
                path: '/list/indicatorSection/programIndicator',
                permissions: [
                    'F_PROGRAM_INDICATOR_PRIVATE_ADD',
                    'F_PROGRAM_INDICATOR_PUBLIC_ADD',
                    'F_PROGRAM_INDICATOR_DELETE',
                ],
            },
            programIndicatorGroup: {
                name: 'Program indicator group',
                path: '/list/indicatorSection/programIndicatorGroup',
                permissions: [
                    'F_PROGAM_INDICATOR_GROUP_PRIVATE_ADD',
                    'F_PROGAM_INDICATOR_GROUP_PUBLIC_ADD',
                    'F_PROGAM_INDICATOR_GROUP_DELETE',
                ],
            },
        },
    },
    organisationUnit: {
        name: 'Organisation unit',
        path: '/list/organisationUnitSection',
        sections: {
            organisationUnit: {
                name: 'Organisation unit',
                path: '/list/organisationUnitSection/organisationUnit',
                permissions: [
                    'F_ORGANISATION_UNIT_PRIVATE_ADD',
                    'F_ORGANISATION_UNIT_PUBLIC_ADD',
                    'F_ORGANISATION_UNIT_DELETE',
                ],
            },
            organisationUnitGroup: {
                name: 'Organisation unit group',
                path: '/list/organisationUnitSection/organisationUnitGroup',
                permissions: [
                    'F_ORGANISATION_UNIT_GROUP_PRIVATE_ADD',
                    'F_ORGANISATION_UNIT_GROUP_PUBLIC_ADD',
                    'F_ORGANISATION_UNIT_GROUP_DELETE',
                ],
            },
            organisationUnitGroupSet: {
                name: 'Organisation unit group set',
                path: '/list/organisationUnitSection/organisationUnitGroupSet',
                permissions: [
                    'F_ORGANISATION_UNIT_GROUP_SET_PRIVATE_ADD',
                    'F_ORGANISATION_UNIT_GROUP_SET_PUBLIC_ADD',
                    'F_ORGANISATION_UNIT_GROUP_SET_DELETE',
                ],
            },
            organisationUnitLevel: {
                name: 'Organisation unit level',
                path: '/list/organisationUnitSection/organisationUnitLevel',
                permissions: [
                    'F_ORGANISATION_UNIT_LEVEL_PRIVATE_ADD',
                    'F_ORGANISATION_UNIT_LEVEL_PUBLIC_ADD',
                    'F_ORGANISATION_UNIT_LEVEL_DELETE',
                ],
            },
            hierarchyOption: {
                name: 'Hierarchy options',
                path: '/list/orgnaisationUnitSection/hierarchy',
                permissions: [
                    'F_HIERARCHY_OPTIONS_PRIVATE_ADD',
                    'F_HIERARCHY_OPTIONS_PUBLIC_ADD',
                    'F_HIERARCHY_OPTIONS_DELETE',
                ],
            },
        },
    },
    program: {
        name: 'Program',
        path: '/list/programSection',
        sections: {
            program: {
                name: 'Program',
                path: '/list/programSection/program',
                permissions: [
                    'F_PROGRAM_PRIVATE_ADD',
                    'F_PROGRAM_PUBLICE_ADD',
                    'F_PROGRAM_DELETE',
                ],
            },
            trackedEntityAttribute: {
                name: 'Tracked entity attribute',
                path: '/list/programSection/tackedEntityAttribute',
                permissions: [
                    'F_TRACKED_ENTITY_ATTRIBUTE_PRIVATE_ADD',
                    'F_TRACKED_ENTITY_ATTRIBUTE_PUBLICE_ADD',
                    'F_TRACKED_ENTITY_ATTRIBUTE_DELETE',
                ],
            },
            trackedEntityType: {
                name: 'Tracked entity type',
                path: '/list/programSection/tackedEntityType',
                permissions: [
                    'F_TRACKED_ENTITY_TYPE_PRIVATE_ADD',
                    'F_TRACKED_ENTITY_TYPE_PUBLICE_ADD',
                    'F_TRACKED_ENTITY_TYPE_DELETE',
                ],
            },
            relationshipType: {
                name: 'Relationship type',
                path: '/list/programSection/relationshipType',
                permissions: [
                    'F_RELATIONSHIP_TYPE_PRIVATE_ADD',
                    'F_RELATIONSHIP_TYPE_PUBLICE_ADD',
                    'F_RELATIONSHIP_TYPE_DELETE',
                ],
            },
            programRule: {
                name: 'Program rule',
                path: '/list/programSection/programRule',
                permissions: [
                    'F_PROGRAM_RULE_PRIVATE_ADD',
                    'F_PROGRAM_RULE_PUBLICE_ADD',
                    'F_PROGRAM_RULE_DELETE',
                ],
            },
            programRuleVariable: {
                name: 'Program rule variable',
                path: '/list/programSection/programRuleVariable',
                permissions: [
                    'F_PROGRAM_RULE_VARIABLE_PRIVATE_ADD',
                    'F_PROGRAM_RULE_VARIABLE_PUBLICE_ADD',
                    'F_PROGRAM_RULE_VARIABLE_DELETE',
                ],
            },
        },
    },
    validation: {
        name: 'Validation',
        path: '/list/validationSection',
        sections: {
            validationRule: {
                name: 'Validation rule',
                path: '/list/validationSectin/validationRule',
                permissions: [
                    'F_VALIDATION_RULE_PRIVATE_ADD',
                    'F_VALIDATION_RULE_PUBLICE_ADD',
                    'F_VALIDATION_RULE_DELETE',
                ],
            },
            validationRuleGroup: {
                name: 'Validation rule group',
                path: '/list/validationSectin/validationRuleGroup',
                permissions: [
                    'F_VALIDATION_RULE_GROUP_PRIVATE_ADD',
                    'F_VALIDATION_RULE_GROUP_PUBLICE_ADD',
                    'F_VALIDATION_RULE_GROUP_DELETE',
                ],
            },
            validationNotification: {
                name: 'Validation notification',
                path: '/list/validationSectin/validationNotification',
                permissions: [
                    'F_VALIDATION_NOTIFICATION_PRIVATE_ADD',
                    'F_VALIDATION_NOTIFICATION_PUBLICE_ADD',
                    'F_VALIDATION_NOTIFICATION_DELETE',
                ],
            },
        },
    },
    other: {
        name: 'Other',
        path: '/list/otherSection',
        sections: {
            constant: {
                name: 'Constant',
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
                permissions: [
                    'F_ATTRIBUTE_PRIVATE_ADD',
                    'F_ATTRIBUTE_PUBLICE_ADD',
                    'F_ATTRIBUTE_DELETE',
                ],
            },
            optionSet: {
                name: 'Option set',
                path: '/list/otherSection/optionSet',
                permissions: [
                    'F_OPTION_SET_PRIVATE_ADD',
                    'F_OPTION_SET_PUBLICE_ADD',
                    'F_OPTION_SET_DELETE',
                ],
            },
            optionGroup: {
                name: 'Option group',
                path: '/list/otherSection/optionGroup',
                permissions: [
                    'F_OPTION_GROUP_PRIVATE_ADD',
                    'F_OPTION_GROUP_PUBLICE_ADD',
                    'F_OPTION_GROUP_DELETE',
                ],
            },
            optionGroupSet: {
                name: 'Option group set',
                path: '/list/otherSection/optionGroupSet',
                permissions: [
                    'F_OPTION_GROUP_SET_PRIVATE_ADD',
                    'F_OPTION_GROUP_SET_PUBLICE_ADD',
                    'F_OPTION_GROUP_SET_DELETE',
                ],
            },
            legend: {
                name: 'Legend',
                path: '/list/otherSection/legend',
                permissions: [
                    'F_LEGEND_PRIVATE_ADD',
                    'F_LEGEND_PUBLICE_ADD',
                    'F_LEGEND_DELETE',
                ],
            },
            predictor: {
                name: 'Predictor',
                path: '/list/otherSection/predictor',
                permissions: [
                    'F_PREDICTOR_PRIVATE_ADD',
                    'F_PREDICTOR_PUBLICE_ADD',
                    'F_PREDICTOR_DELETE',
                ],
            },
            predictorGroup: {
                name: 'Predictor group',
                path: '/list/otherSection/predictorGroup',
                permissions: [
                    'F_PREDICTOR_GROUP_PRIVATE_ADD',
                    'F_PREDICTOR_GROUP_PUBLICE_ADD',
                    'F_PREDICTOR_GROUP_DELETE',
                ],
            },
            pushAnalysis: {
                name: 'Push analysis',
                path: '/list/otherSection/pushAnalysis',
                permissions: [
                    'F_PUSH_ANALYSIS_PRIVATE_ADD',
                    'F_PUSH_ANALYSIS_PUBLICE_ADD',
                    'F_PUSH_ANALYSIS_DELETE',
                ],
            },
            externalMapLayer: {
                name: 'External map layer',
                path: '/list/otherSection/externalMapLayer',
                permissions: [
                    'F_EXTERNAL_MAP_LAYER_PRIVATE_ADD',
                    'F_EXTERNAL_MAP_LAYER_PUBLICE_ADD',
                    'F_EXTERNAL_MAP_LAYER_DELETE',
                ],
            },
            dataApprovalLevel: {
                name: 'Data approval level',
                path: '/list/otherSection/dataApprovalLevel',
                permissions: [
                    'F_DATA_APPROVAL_LEVEL_PRIVATE_ADD',
                    'F_DATA_APPROVAL_LEVEL_PUBLICE_ADD',
                    'F_DATA_APPROVAL_LEVEL_DELETE',
                ],
            },
            dataApprovalWorkflow: {
                name: 'Data approval workflow',
                path: '/list/otherSection/dataApprovalWorkflow',
                permissions: [
                    'F_DATA_APPROVAL_WORKFLOW_PRIVATE_ADD',
                    'F_DATA_APPROVAL_WORKFLOW_PUBLICE_ADD',
                    'F_DATA_APPROVAL_WORKFLOW_DELETE',
                ],
            },
            locale: {
                name: 'Locale',
                path: '/list/otherSection/locale',
                permissions: [
                    'F_LOCALE_PRIVATE_ADD',
                    'F_LOCALE_PUBLICE_ADD',
                    'F_LOCALE_DELETE',
                ],
            },
            sqlView: {
                name: 'SQL View',
                path: '/list/otherSection/sqlView',
                permissions: [
                    'F_SQL_VIEW_PRIVATE_ADD',
                    'F_SQL_VIEW_PUBLICE_ADD',
                    'F_SQL_VIEW_DELETE',
                ],
            },
        },
    },
}
