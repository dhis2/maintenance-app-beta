import { generateMock } from '@anatine/zod-mock'
import { faker } from '@faker-js/faker'
import { z } from 'zod'
import { modelFormSchemas } from '../lib'
import { categoryListSchema } from '../pages/categories/form'
import { categoryComboListSchema } from '../pages/categoryCombos/form'
import { categoryOptionComboListSchema } from '../pages/categoryOptionCombos/form'
import { categoryOptionGroupListSchema } from '../pages/categoryOptionGroups/form/categoryOptionGroupSchema'
import { categoryOptionGroupSetListSchema } from '../pages/categoryOptionGroupSets/form/categoryOptionGroupSetSchema'
import { categoryOptionListSchema } from '../pages/categoryOptions/form/categoryOptionSchema'
import { dataElementGroupSchema } from '../pages/dataElementGroups/form'
import { dataElementGroupSetSchema } from '../pages/dataElementGroupSets/form'
import { dataElementSchema } from '../pages/dataElements/form'
import { DataSetNotificationTemplateSchema } from '../pages/dataSetNotificationTemplates/form/DataSetNotificationTemplateSchema'
import { dataSetListSchema } from '../pages/dataSetsWip/form/dataSetFormSchema'
import { IndicatorSchema } from '../pages/indicators/form/IndicatorSchema'
import { IndicatorTypeListSchema } from '../pages/indicatorTypes/form/IndicatorTypesSchema'
import { organisationUnitGroupListSchema } from '../pages/organisationUnitGroups/form/organisationUnitGroupSchema'
import { organisationUnitGroupSetListSchema } from '../pages/organisationUnitGroupSets/form/organisationUnitGroupSetSchema'
import { organisationUnitListSchema } from '../pages/organisationUnits/form/organisationUnitSchema'
import {
    CategoryMapping,
    OptionMapping,
    OrganisationUnit,
} from '../types/generated'

const { withDefaultListColumns } = modelFormSchemas

export const randomDhis2Id = () =>
    faker.helpers.fromRegExp(/[a-zA-Z]{1}[a-zA-Z0-9]{10}/)

function randomValueIn<T>(list: T[]) {
    return list[faker.number.int({ min: 0, max: list.length - 1 })]
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

const { identifiable, referenceCollection, withAttributeValues } =
    modelFormSchemas

const UserSchema = identifiable.extend({
    code: z.string().optional(),
    displayName: z.string(),
    username: z.string(),
})

const UserGroupSchema = identifiable.extend({
    displayName: z.string(),
})

const AccessSchema = z.object({
    delete: z.boolean(),
    externalize: z.boolean(),
    manage: z.boolean(),
    read: z.boolean(),
    update: z.boolean(),
    write: z.boolean(),
    data: z.object({
        read: z.boolean(),
        write: z.boolean(),
    }),
})

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
    ...generateMock(IndicatorTypeListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testIndicator = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(IndicatorSchema, {
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

export const testCategoryCombo = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(categoryComboListSchema, {
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

export const testCategoryOptionGroupSet = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(categoryOptionGroupSetListSchema, { mockeryMapper }),
    ...overwrites,
})

export const testDataElementGroup = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(dataElementGroupSchema.merge(withDefaultListColumns), {
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
    ...generateMock(dataElementSchema.merge(withDefaultListColumns), {
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
    ...generateMock(DataSetNotificationTemplateSchema, {
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

export const testProgram = ({
    id = randomDhis2Id(),
    name = faker.person.fullName(),
    categoryMappings = [] as CategoryMapping[],
} = {}) => ({
    id,
    name,
    displayName: name,
    categoryMappings,
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
