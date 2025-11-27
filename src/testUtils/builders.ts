import { generateMock } from '@anatine/zod-mock'
import { faker } from '@faker-js/faker'
import { modelFormSchemas } from '../lib'
import {
    AccessSchema,
    UserGroupSchema,
    UserSchema,
} from '../lib/form/modelFormSchemas'
import {
    attributeListSchema,
    attributeFormSchema,
} from '../pages/attributes/form'
import {
    categoryFormSchema,
    categoryListSchema,
} from '../pages/categories/form'
import {
    categoryComboFormSchema,
    categoryComboListSchema,
} from '../pages/categoryCombos/form'
import { categoryOptionComboListSchema } from '../pages/categoryOptionCombos/form'
import {
    categoryOptionGroupFormSchema,
    categoryOptionGroupListSchema,
} from '../pages/categoryOptionGroups/form/categoryOptionGroupSchema'
import {
    categoryOptionGroupSetFormSchema,
    categoryOptionGroupSetListSchema,
} from '../pages/categoryOptionGroupSets/form/categoryOptionGroupSetSchema'
import { categoryOptionListSchema } from '../pages/categoryOptions/form/categoryOptionSchema'
import { ConstantsListSchema } from '../pages/constants/form/ConstantFormSchema'
import { dataApprovalLevelListSchema } from '../pages/dataApprovalLevels/form/dataApprovalLevelsSchema'
import { dataApprovalWorkflowListSchema } from '../pages/dataApprovalWorkflows/form/dataApprovalWorkflowSchema'
import { dataElementGroupListSchema } from '../pages/dataElementGroups/form/dataElementGroupSchema'
import { dataElementGroupSetSchema } from '../pages/dataElementGroupSets/form'
import { dataElementListSchema } from '../pages/dataElements/form/dataElementSchema'
import {
    dataSetNotificationTemplateListSchema,
    dataSetNotificationTemplateFormSchema,
} from '../pages/dataSetNotificationTemplates/form/dataSetNotificationTemplateSchema'
import { dataSetListSchema } from '../pages/dataSets/form/dataSetFormSchema'
import { indicatorGroupListSchema } from '../pages/indicatorGroups/form/indicatorGroupSchema'
import { indicatorGroupSetListSchema } from '../pages/indicatorGroupSets/form/indicatorGroupSetSchema'
import { indicatorListSchema } from '../pages/indicators/form/indicatorSchema'
import { indicatorTypeListSchema } from '../pages/indicatorTypes/form/indicatorTypesSchema'
import { legendSetListSchema } from '../pages/legendSets/form/legendSetListSchema'
import { OptionGroupListSchema } from '../pages/optionGroups/form/OptionGroupFormSchema'
import {
    optionGroupSetFormSchema,
    optionGroupSetListSchema,
} from '../pages/optionGroupSets/form/optionGroupSetSchema'
import { optionSetListSchema } from '../pages/optionSets/form/optionSetSchema'
import { organisationUnitGroupListSchema } from '../pages/organisationUnitGroups/form/organisationUnitGroupSchema'
import { organisationUnitGroupSetListSchema } from '../pages/organisationUnitGroupSets/form/organisationUnitGroupSetSchema'
import { organisationUnitListSchema } from '../pages/organisationUnits/form/organisationUnitSchema'
import { programIndicatorGroupListSchema } from '../pages/programIndicatorGroups/form'
import { programIndicatorsListSchema } from '../pages/programIndicators/form/programIndicatorsFormSchema'
import { programListSchema } from '../pages/programsWip/form'
import { relationshipTypeListSchema } from '../pages/relationshipTypes/form/RelationshipTypeFormSchema'
import { trackedEntityAttributeListSchema } from '../pages/trackedEntityAttributes/form/TrackedEntityAttributeFormSchema'
import { trackedEntityTypeListSchema } from '../pages/trackedEntityTypes/form'
import {
    validationNotificationTemplateListSchema,
    validationNotificationTemplateFormSchema,
} from '../pages/validationNotificationTemplates/form'
import {
    validationRuleGroupsFormSchema,
    validationRuleGroupsListSchema,
} from '../pages/validationRuleGroups/form/validationRuleGroupsSchema'
import {
    CategoryMapping,
    DataElement,
    OptionMapping,
    OrganisationUnit,
    Program,
    ProgramTrackedEntityAttribute,
} from '../types/generated'

const { withDefaultListColumns } = modelFormSchemas

export const randomDhis2Id = () =>
    faker.helpers.fromRegExp(/[a-zA-Z]{1}[a-zA-Z0-9]{10}/)

export function randomValueIn<T>(list: T[]) {
    return list[faker.number.int({ min: 0, max: list.length - 1 })]
}

export const randomLongString = (length: number) => {
    const base = faker.lorem.paragraph() // Or .sentence(), .text()
    let result = ''
    while (result.length < length) {
        result += base + ' '
    }
    return result.slice(0, length) // Trim to exact length
}

const mockeryMapper = (keyName: string) => {
    if (keyName === 'code') {
        return () => faker.string.alphanumeric(6)
    }
    if (keyName === 'id') {
        return () => randomDhis2Id()
    }
    return undefined
}

const { withAttributeValues } = modelFormSchemas

export const testAccess = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(AccessSchema, { mockeryMapper }),
    ...overwrites,
})

export const testUser = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(UserSchema, { mockeryMapper }),
    ...overwrites,
})

export const testUserGroup = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(UserGroupSchema, { mockeryMapper }),
    ...overwrites,
})

export const testIndicatorType = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(indicatorTypeListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testOptionGroup = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(OptionGroupListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testConstant = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(ConstantsListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testIndicator = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(indicatorListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testLegendSets = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(legendSetListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testIndicatorGroup = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(indicatorGroupListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testIndicatorGroupSet = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(indicatorGroupSetListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testCategoryOption = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(categoryOptionListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testCategory = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(categoryListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testCategoryForm = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(categoryFormSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testCategoryCombo = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(categoryComboListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testCategoryComboForm = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(categoryComboFormSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testCategoryOptionCombo = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(categoryOptionComboListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testCategoryOptionGroup = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(categoryOptionGroupListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testCategoryOptionGroupForm = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(categoryOptionGroupFormSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testCategoryOptionGroupSet = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(categoryOptionGroupSetListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testCategoryOptionGroupSetForm = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(categoryOptionGroupSetFormSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testDataElementGroup = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(dataElementGroupListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testDataElementGroupSet = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(dataElementGroupSetSchema.merge(withDefaultListColumns), {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testDataElement = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(dataElementListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testDataSet = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(dataSetListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testDataSetNotificationTemplate = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(dataSetNotificationTemplateListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testDataSetNotificationTemplateForm = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(dataSetNotificationTemplateFormSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testPrograms = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(programListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testOptionGroupSet = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(optionGroupSetFormSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testOptionSets = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(optionSetListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testOptionGroupSetList = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(optionGroupSetListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testOrganisationUnitGroup = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(organisationUnitGroupListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testOrganisationUnitGroupSet = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(organisationUnitGroupSetListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testProgramIndicator = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(programIndicatorsListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testAttributeList = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(attributeListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testdataApprovalLevelList = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(dataApprovalLevelListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testDataApprovalWorkflowList = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(dataApprovalWorkflowListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testAttributeForm = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(attributeFormSchema, { mockeryMapper }),
    ...overwrites,
})

export const testLocale = ({
    locale = faker.string.alpha({ length: 2 }),
    name = faker.location.country(),
} = {}) => ({
    locale,
    name,
    displayNAme: name,
})

export const testCategoryMapping = ({
    id = randomDhis2Id(),
    categoryId = randomDhis2Id(),
    mappingName = faker.company.name(),
    optionMappings = [] as OptionMapping[],
} = {}) => ({
    id,
    categoryId,
    mappingName,
    optionMappings,
})

export const testProgramIndicatorGroup = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(programIndicatorGroupListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testFormProgramIndicatorGroup = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(programIndicatorGroupListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testRelationshipType = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(relationshipTypeListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testTrackedEntityType = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(trackedEntityTypeListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testTrackedEntityAttribute = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(trackedEntityAttributeListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testValidationNotificationTemplate = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(validationNotificationTemplateListSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testValidationNotificationTemplateForm = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(validationNotificationTemplateFormSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testCustomAttribute = ({
    id = randomDhis2Id(),
    displayFormName = faker.person.fullName(),
    mandatory = faker.datatype.boolean(),
    valueType = 'TEXT',
} = {}) => ({
    id,
    displayFormName,
    mandatory,
    valueType,
})

export const testProgram = ({
    id = randomDhis2Id(),
    name = faker.person.fullName(),
    categoryMappings = [] as CategoryMapping[],
    programType = randomValueIn([
        'WITH_REGISTRATION',
        'WITHOUT_REGISTRATION',
    ]) as Program.programType,
    programTrackedEntityAttributes = [] as ProgramTrackedEntityAttribute[],
} = {}) => ({
    id,
    name,
    displayName: name,
    categoryMappings,
    programType,
    programTrackedEntityAttributes,
})

export const testLegendSet = ({
    id = randomDhis2Id(),
    displayName = faker.person.fullName(),
} = {}) => ({
    id,
    displayName,
})

export const testOrgUnitLevel = ({
    id = randomDhis2Id(),
    name = faker.person.fullName(),
    displayName = faker.person.fullName(),
    access = testAccess(),
    level = null as number | null,
    offlineLevels = null as number | null,
    lastUpdated = faker.date.past().toUTCString(),
} = {}) => ({
    id,
    name,
    displayName,
    access,
    level,
    offlineLevels,
    lastUpdated,
})

export const testOrgUnit = (overwrites: Record<any, any> | undefined = {}) => {
    const mock = generateMock(organisationUnitListSchema, { mockeryMapper })
    return {
        ...mock,
        parent: {
            id: overwrites?.parentId ?? null,
        },
        ancestors: [],
        level: null,
        childCount: 0,
        path: `/${mock.id}`,
        ...overwrites,
    } as unknown as Partial<OrganisationUnit>
}

export const testValidationRuleGroups = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(validationRuleGroupsListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testValidationRuleGroupsForm = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(validationRuleGroupsFormSchema, {
        mockeryMapper,
    }),
    ...overwrites,
})

// TODO: change when schema for optionset is available
export const testOptionSet = ({
    id = randomDhis2Id(),
    displayName = faker.person.fullName(),
    valueType = randomValueIn(Object.keys(DataElement.valueType)),
} = {}) => ({
    id,
    displayName,
    valueType,
})

export const testOption = ({
    id = randomDhis2Id(),
    name,
    displayName,
}: {
    id?: string
    name?: string
    displayName?: string
} = {}) => {
    const optionName = name ?? faker.word.sample()
    return {
        id,
        name: optionName,
        displayName: displayName ?? optionName,
    }
}

// TODO: change when schema for validationRule is available
export const testValidationRule = ({
    id = randomDhis2Id(),
    displayName = faker.person.fullName(),
} = {}) => ({
    id,
    displayName,
})
