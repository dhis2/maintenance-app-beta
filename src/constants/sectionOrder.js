import {
    categorySections,
    dataElementSections,
    dataSetSections,
    indicatorSections,
    organisationUnitSections,
    programSections,
    validationSections,
    otherSections,
} from './sections'

/**
 * @typedef {Object} SectionConfig
 * @property {boolean} [hideInCardMenu]
 * @property {boolean} [hideInSideBar]
 */

/**
 * @typedef {[ Section, SectionConfig ]} SectionWithConfig
 */

/**
 * @type {Object.<string, (Section|SectionWithConfig)[]>}
 */
export const sectionOrder = {
    category: [
        categorySections.categoryOption,
        categorySections.category,
        categorySections.categoryCombo,
        categorySections.categoryOptionCombo,
        categorySections.categoryOptionGroup,
        categorySections.categoryOptionGroupSet,
    ],
    dataElement: [
        dataElementSections.dataElement,
        dataElementSections.dataElementGroup,
        dataElementSections.dataElementGroupSet,
    ],
    dataSet: [dataSetSections.dataSet, dataSetSections.dataSetNotification],
    indicator: [
        indicatorSections.indicator,
        indicatorSections.indicatorType,
        indicatorSections.indicatorGroup,
        indicatorSections.indicatorGroupSet,
        indicatorSections.programIndicator,
        indicatorSections.programIndicatorGroup,
    ],
    organisationUnit: [
        organisationUnitSections.organisationUnit,
        organisationUnitSections.organisationUnitGroup,
        organisationUnitSections.organisationUnitGroupSet,
        organisationUnitSections.organisationUnitLevel,
        [organisationUnitSections.hierarchyOption, { hideInCardMenu: true }],
    ],
    program: [
        programSections.program,
        programSections.trackedEntityAttribute,
        programSections.trackedEntityType,
        programSections.relationshipType,
        programSections.programRule,
        programSections.programRuleVariable,
    ],
    validation: [
        validationSections.validationRule,
        validationSections.validationRuleGroup,
        validationSections.validationNotification,
    ],
    other: [
        otherSections.constant,
        otherSections.attribute,
        otherSections.optionSet,
        otherSections.optionGroup,
        otherSections.optionGroupSet,
        otherSections.legend,
        otherSections.predictor,
        otherSections.predictorGroup,
        otherSections.pushAnalysis,
        otherSections.externalMapLayer,
        otherSections.dataApprovalLevel,
        otherSections.dataApprovalWorkflow,
        otherSections.locale,
        otherSections.sqlView,
    ],
}
