import i18n from "@dhis2/d2-i18n";

export type Section = {
    name: string;
    namePlural?: string;
    titlePlural?: string;
    title: string;
};
type SectionMap = {
    [key: string]: Section;
};

export const SECTIONS_MAP = {
    category: {
        name: "category",
        namePlural: "categories",
        title: i18n.t("Category"),
        titlePlural: i18n.t("Categories"),
    },
    categoryOption: {
        name: "categoryOption",
        namePlural: "categoryOptions",
        title: i18n.t("Category option"),
        titlePlural: i18n.t("Category options"),
    },
    categoryCombo: {
        name: "categoryCombo",
        namePlural: "categoryCombos",
        title: i18n.t("Category combo"),
        titlePlural: i18n.t("Category combos"),
    },
    categoryOptionCombo: {
        name: "categoryOptionCombo",
        namePlural: "categoryOptionCombos",
        title: i18n.t("Category option combination"),
        titlePlural: i18n.t("Category option combinations"),
    },
    categoryOptionGroup: {
        name: "categoryOptionGroup",
        namePlural: "categoryOptionGroups",
        title: i18n.t("Category option group"),
        titlePlural: i18n.t("Category option groups"),
    },
    categoryOptionGroupSet: {
        name: "categoryOptionGroupSet",
        namePlural: "categoryOptionGroupSets",
        title: i18n.t("Category option group set"),
        titlePlural: i18n.t("Category option group sets"),
    },
    dataElement: {
        name: "dataElement",
        namePlural: "dataElements",
        title: i18n.t("Data element"),
        titlePlural: i18n.t("Data elements"),
    },
    dataElementGroup: {
        name: "dataElementGroup",
        namePlural: "dataElementGroups",
        title: i18n.t("Data element group"),
        titlePlural: i18n.t("Data element groups"),
    },
    dataElementGroupSet: {
        name: "dataElementGroupSet",
        namePlural: "dataElementGroupSets",
        title: i18n.t("Data element group set"),
        titlePlural: i18n.t("Data element group sets"),
    },
    dataSet: {
        name: "dataSet",
        namePlural: "dataSets",
        title: i18n.t("Data set"),
        titlePlural: i18n.t("Data sets"),
    },
    dataSetNotification: {
        name: "dataSetNotificationTemplate",
        namePlural: "dataSetNotificationTemplates",
        title: i18n.t("Data set notification"),
        titlePlural: i18n.t("Data set notification templates"),
    },
    indicator: {
        name: "indicator",
        namePlural: "indicators",
        title: i18n.t("Indicator"),
        titlePlural: i18n.t("Indicators"),
    },
    indicatorType: {
        name: "indicatorType",
        namePlural: "indicatorTypes",
        title: i18n.t("Indicator type"),
        titlePlural: i18n.t("Indicator types"),
    },
    indicatorGroup: {
        name: "indicatorGroup",
        namePlural: "indicatorGroups",
        title: i18n.t("Indicator group"),
        titlePlural: i18n.t("Indicator groups"),
    },
    indicatorGroupSet: {
        name: "indicatorGroupSet",
        namePlural: "indicatorGroupSets",
        title: i18n.t("Indicator group set"),
        titlePlural: i18n.t("Indicator group sets"),
    },
    organisationUnit: {
        name: "organisationUnit",
        namePlural: "organisationUnits",
        title: i18n.t("Organisation unit"),
        titlePlural: i18n.t("Organisation units"),
    },
    organisationUnitGroup: {
        name: "organisationUnitGroup",
        namePlural: "organisationUnitGroups",
        title: i18n.t("Organisation unit group"),
        titlePlural: i18n.t("Organisation unit groups"),
    },
    organisationUnitGroupSet: {
        name: "organisationUnitGroupSet",
        namePlural: "organisationUnitGroupSets",
        title: i18n.t("Organisation unit group set"),
        titlePlural: i18n.t("Organisation unit group sets"),
    },
    trackedEntityAttribute: {
        name: "trackedEntityAttribute",
        namePlural: "trackedEntityAttributes",
        title: i18n.t("Tracked entity attribute"),
        titlePlural: i18n.t("Tracked entity attributes"),
    },
    trackedEntityType: {
        name: "trackedEntityType",
        namePlural: "trackedEntityTypes",
        title: i18n.t("Tracked entity type"),
        titlePlural: i18n.t("Tracked entity types"),
    },
    programsAndTracker: {
        name: "programsAndTracker",
        title: i18n.t("Programs and Tracker"),
    },
    program: {
        name: "program",
        namePlural: "programs",
        title: i18n.t("Program"),
        titlePlural: i18n.t("Programs"),
    },
    programIndicator: {
        name: "programIndicator",
        namePlural: "programIndicators",
        title: i18n.t("Program indicator"),
        titlePlural: i18n.t("Program indicators"),
    },
    programIndicatorGroup: {
        name: "programIndicatorGroup",
        namePlural: "programIndicatorGroups",
        title: i18n.t("Program indicatorGroup"),
        titlePlural: i18n.t("Program indicatorGroups"),
    },
    programRule: {
        name: "programRule",
        namePlural: "programRules",
        title: i18n.t("Program rule"),
        titlePlural: i18n.t("Program rules"),
    },
    programRuleVariable: {
        name: "programRuleVariable",
        namePlural: "programRuleVariables",
        title: i18n.t("Program rule variable"),
        titlePlural: i18n.t("Program rule variables"),
    },
    programStage: {
        name: "programStage",
        namePlural: "programStages",
        title: i18n.t("Program stage"),
        titlePlural: i18n.t("Program stages"),
    },
    validation: {
        name: "validation",
        namePlural: "validations",
        title: i18n.t("Validation"),
        titlePlural: i18n.t("Validations"),
    },
    validationRule: {
        name: "validationRule",
        namePlural: "validationRules",
        title: i18n.t("Validation rule"),
        titlePlural: i18n.t("Validation rules"),
    },
    validationRuleGroup: {
        name: "validationRuleGroup",
        namePlural: "validationRuleGroups",
        title: i18n.t("Validation rule group"),
        titlePlural: i18n.t("Validation rule groups"),
    },
    validationNotification: {
        name: "validationNotificationTemplate",
        namePlural: "validationNotificationTemplates",
        title: i18n.t("Validation notification"),
        titlePlural: i18n.t("Validation notification templates"),
    },
    constant: {
        name: "constant",
        namePlural: "constants",
        title: i18n.t("Constant"),
        titlePlural: i18n.t("Constants"),
    },
    attribute: {
        name: "attribute",
        namePlural: "attributes",
        title: i18n.t("Attribute"),
        titlePlural: i18n.t("Attributes"),
    },
    optionSet: {
        name: "optionSet",
        namePlural: "optionSets",
        title: i18n.t("Option set"),
        titlePlural: i18n.t("Option sets"),
    },
    predictor: {
        name: "predictor",
        namePlural: "predictors",
        title: i18n.t("Predictor"),
        titlePlural: i18n.t("Predictors"),
    },
    pushAnalysis: {
        name: "pushAnalysi",
        namePlural: "pushAnalysis",
        title: i18n.t("Push analysis"),
        titlePlural: i18n.t("Push analyses"),
    },
    externalMapLayer: {
        name: "externalMapLayer",
        namePlural: "externalMapLayers",
        title: i18n.t("External map layer"),
        titlePlural: i18n.t("External map layers"),
    },
    dataApprovalLevel: {
        name: "dataApprovalLevel",
        namePlural: "dataApprovalLevels",
        title: i18n.t("Data approval level"),
        titlePlural: i18n.t("Data approval levels"),
    },
    dataApprovalWorkflow: {
        name: "dataApprovalWorkflow",
        namePlural: "dataApprovalWorkflows",
        title: i18n.t("Data approval workflow"),
        titlePlural: i18n.t("Data approval workflows"),
    },
    locale: {
        name: "locale",
        namePlural: "locales",
        title: i18n.t("Locale"),
        titlePlural: i18n.t("Locales"),
    },
    sqlView: {
        name: "sqlView",
        namePlural: "sqlViews",
        title: i18n.t("SQL view"),
        titlePlural: i18n.t("SQL views"),
    },
} as const satisfies SectionMap;

export type SectionName =
    (typeof SECTIONS_MAP)[keyof typeof SECTIONS_MAP]["schemaName"];
export type SectionNamePlural =
    (typeof SECTIONS_MAP)[keyof typeof SECTIONS_MAP]["pluralSchemaName"];

export const SECTIONS: Section[] = Object.values(SECTIONS_MAP);
