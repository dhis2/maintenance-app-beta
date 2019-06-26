import { sections } from './sections'

const {
    category,
    dataElement,
    dataSet,
    indicator,
    organisationUnit,
    program,
    validation,
    other,
} = sections

export const mainSectionOrder = [
    category,
    dataElement,
    dataSet,
    indicator,
    organisationUnit,
    program,
    validation,
    other,
]

export const subSectionOrder = {
    category: [
        category.sections.categoryOption,
        category.sections.category,
        category.sections.categoryCombo,
        category.sections.categoryOptionCombo,
        category.sections.categoryOptionGroup,
        category.sections.categoryOptionGroupSet,
    ],
    dataElement: [
        dataElement.sections.dataElement,
        dataElement.sections.dataElementGroup,
        dataElement.sections.dataElementGroupSet,
    ],
    dataSet: [dataSet.sections.dataSet, dataSet.sections.dataSetNotification],
    indicator: [
        indicator.sections.indicator,
        indicator.sections.indicatorType,
        indicator.sections.indicatorGroup,
        indicator.sections.indicatorGroupSet,
        indicator.sections.programIndicator,
        indicator.sections.programIndicatorGroup,
    ],
    organisationUnit: [
        organisationUnit.sections.organisationUnit,
        organisationUnit.sections.organisationUnitGroup,
        organisationUnit.sections.organisationUnitGroupSet,
        organisationUnit.sections.organisationUnitLevel,
        organisationUnit.sections.hierarchyOption,
    ],
    program: [
        program.sections.program,
        program.sections.trackedEntityAttribute,
        program.sections.trackedEntityType,
        program.sections.relationshipType,
        program.sections.programRule,
        program.sections.programRuleVariable,
    ],
    validation: [
        validation.sections.validationRule,
        validation.sections.validationRuleGroup,
        validation.sections.validationNotification,
    ],
    other: [
        other.sections.constant,
        other.sections.attribute,
        other.sections.optionSet,
        other.sections.optionGroup,
        other.sections.optionGroupSet,
        other.sections.legend,
        other.sections.predictor,
        other.sections.predictorGroup,
        other.sections.pushAnalysis,
        other.sections.externalMapLayer,
        other.sections.dataApprovalLevel,
        other.sections.dataApprovalWorkflow,
        other.sections.locale,
        other.sections.sqlView,
    ],
}
