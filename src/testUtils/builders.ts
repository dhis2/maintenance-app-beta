import { faker } from '@faker-js/faker'
import {
    CategoryMapping,
    OptionMapping,
    OrganisationUnit,
    User,
} from '../types/generated'

export const randomDhis2Id = () =>
    faker.helpers.fromRegExp(/[a-zA-Z]{1}[a-zA-Z0-9]{10}/)

export const testPager = ({
    page = faker.number.int({ min: 0, max: 5 }),
    total = faker.number.int({ min: 0, max: 50 }),
    pageSize = 50,
    pageCount = faker.number.int({ min: 0, max: 5 }),
} = {}) => ({
    page,
    total,
    pageSize,
    pageCount,
})

export const testAccess = ({
    deleteAccess = faker.datatype.boolean(),
    externalizeAccess = faker.datatype.boolean(),
    manageAccess = faker.datatype.boolean(),
    readAccess = faker.datatype.boolean(),
    updateAccess = faker.datatype.boolean(),
    writeAccess = faker.datatype.boolean(),
    readDataAcess = faker.datatype.boolean(),
    writeDataAccess = faker.datatype.boolean(),
} = {}) => ({
    data: {
        read: readDataAcess,
        write: writeDataAccess,
    },
    delete: deleteAccess,
    externalize: externalizeAccess,
    manage: manageAccess,
    read: readAccess,
    update: updateAccess,
    write: writeAccess,
})

export const testUser = ({
    id = randomDhis2Id(),
    code = null,
    name = faker.person.fullName(),
    username = faker.internet.userName(),
} = {}) =>
    ({
        id,
        code,
        name,
        displayName: name,
        username,
    } as User)

export const testOrgUnit = ({
    id = randomDhis2Id(),
    code = faker.string.alphanumeric(6),
    name = faker.location.city(),
    created = faker.date.past().toUTCString(),
    lastUpdated = faker.date.past().toUTCString(),
    createdBy = testUser(),
    lastUpdatedBy = testUser(),
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

export const testIndicatorType = ({
    id = randomDhis2Id(),
    name = faker.word.noun(),
    factor = faker.number.int({ min: 0, max: 10 }),
} = {}) => ({
    id,
    name,
    displayName: name,
    factor,
})

export const testIndicator = ({
    id = randomDhis2Id(),
    name = faker.word.noun(),
} = {}) => ({
    id,
    name,
    displayName: name,
})

export const testCategoryOption = ({
    id = randomDhis2Id(),
    name = faker.word.noun(),
} = {}) => ({
    id,
    name,
    displayName: name,
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
