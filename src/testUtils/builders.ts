import { generateMock } from '@anatine/zod-mock'
import { faker } from '@faker-js/faker'
import { z } from 'zod'
import { modelFormSchemas } from '../lib'
import { categorySchema } from '../pages/categories/form'
import { categoryComboSchema } from '../pages/categoryCombos/form'
import { categoryOptionComboSchema } from '../pages/categoryOptionCombos/form'
import { categoryOptionGroupSchema } from '../pages/categoryOptionGroups/form/categoryOptionGroupSchema'
import { categoryOptionGroupSetSchema } from '../pages/categoryOptionGroupSets/form/categoryOptionGroupSetSchema'
import { categoryOptionSchema } from '../pages/categoryOptions/form/categoryOptionSchema'
import { dataElementGroupSchema } from '../pages/dataElementGroups/form'
import { dataElementGroupSetSchema } from '../pages/dataElementGroupSets/form'
import { dataElementSchema } from '../pages/dataElements/form'
import { dataSetFormSchema } from '../pages/dataSetsWip/form/dataSetFormSchema'
import { IndicatorTypeSchema } from '../pages/indicatorTypes/form'
import { organisationUnitGroupSchema } from '../pages/organisationUnitGroups/form'
import { organisationUnitGroupSetSchema } from '../pages/organisationUnitGroupSets/form'
import { organisationUnitSchema } from '../pages/organisationUnits/form'
import {
    CategoryMapping,
    OptionMapping,
    OrganisationUnit,
    User,
} from '../types/generated'

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

const withDefaultListColumns = z.object({
    displayName: z.string(),
    lastUpdated: z.coerce.date(),
    createdBy: UserSchema,
    lastUpdatedBy: UserSchema,
    access: AccessSchema,
    href: z.string().url(),
    sharing: z.object({ public: z.literal('rw------') }),
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

const readOrganisationUnitColumns = z.object({
    ancestors: z.array(organisationUnitSchema),
    level: z.number().or(z.null()),
    childCount: z.number(),
})

export const testIndicatorType = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(
        IndicatorTypeSchema.merge(withDefaultListColumns).extend({
            code: z.string(),
        }),
        { mockeryMapper }
    ),
    ...overwrites,
})

export const testIndicator = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(
        identifiable.merge(withDefaultListColumns).extend({ code: z.string() }),
        { mockeryMapper }
    ),
    ...overwrites,
})

export const testCategoryOption = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(
        categoryOptionSchema._def.schema.merge(withDefaultListColumns),
        { mockeryMapper }
    ),
    ...overwrites,
})

export const testCategory = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(categorySchema.merge(withDefaultListColumns), {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testCategoryCombo = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(categoryComboSchema.merge(withDefaultListColumns), {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testCategoryOptionCombo = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(categoryOptionComboSchema.merge(withDefaultListColumns), {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testCategoryOptionGroup = (overwrites: Record<any, any> = {}) => ({
    ...generateMock(categoryOptionGroupSchema.merge(withDefaultListColumns), {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testCategoryOptionGroupSet = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(
        categoryOptionGroupSetSchema.merge(withDefaultListColumns),
        { mockeryMapper }
    ),
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
    ...generateMock(dataSetFormSchema.merge(withDefaultListColumns), {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testOrganisationUnitGroup = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(organisationUnitGroupSchema.merge(withDefaultListColumns), {
        mockeryMapper,
    }),
    ...overwrites,
})

export const testOrganisationUnitGroupSet = (
    overwrites: Record<any, any> = {}
) => ({
    ...generateMock(
        organisationUnitGroupSetSchema.merge(withDefaultListColumns),
        { mockeryMapper }
    ),
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

// export const testOrgUnit =  (overwrites: Record<any,any> | undefined) => (
//     {...generateMock((organisationUnitSchema._def.schema).merge(withDefaultListColumns).merge(readOrganisationUnitColumns), {mockeryMapper} ),
//         parent: {
//             id: overwrites.parentId || null,
//         },
//         ancestors: [],
//         level: null,
//         childCount: 0,
//         ...overwrites,
//
//     })

export const testOrgUnit = ({
    id = randomDhis2Id(),
    code = faker.string.alphanumeric(6),
    name = faker.location.city(),
    created = faker.date.past().toUTCString(),
    lastUpdated = faker.date.past().toUTCString(),
    createdBy = testUser() as User,
    lastUpdatedBy = testUser() as User,
    parentId = null as string | null,
    ancestors = [] as Partial<OrganisationUnit>[],
    level = null as number | null,
    childCount = 0,
    access = testAccess(),
} = {}) =>
    ({
        code,
        name,
        created: created,
        lastUpdated,
        createdBy,
        lastUpdatedBy,
        sharing: {},
        shortName: name.slice(0, 5),
        parent: parentId
            ? {
                  id: parentId,
              }
            : undefined,
        path: `/${id}`,
        displayName: name,
        href: faker.internet.url(),
        id,
        level: level || ancestors.length,
        ancestors,
        childCount,
        access,
    } as Partial<OrganisationUnit>)
