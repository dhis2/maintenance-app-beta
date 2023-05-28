/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { QueryModifiers } from './QueryModifiers'
import type { DataSet } from './DataSet'
import type { FileResource } from './FileResource'
import type { LegendSet } from './LegendSet'
import type { OrganisationUnitGroup } from './OrganisationUnitGroup'
import type { Program } from './Program'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type OrganisationUnit = {
    access: Access
    address: string
    aggregationType: OrganisationUnit.aggregationType
    ancestors: Array<OrganisationUnit>
    attributeValues: Array<AttributeValue>
    children: Array<OrganisationUnit>
    closedDate: string
    code: string
    comment: string
    contactPerson: string
    created: string
    createdBy: User
    dataSets: Array<DataSet>
    description: string
    dimensionItem: string
    displayDescription: string
    displayFormName: string
    displayName: string
    displayShortName: string
    email: string
    favorite: boolean
    favorites: Array<string>
    formName: string
    geometry: Record<string, any>
    href: string
    id: string
    image: FileResource
    lastUpdated: string
    lastUpdatedBy: User
    leaf: boolean
    legendSet: LegendSet
    legendSets: Array<LegendSet>
    level: number
    memberCount: number
    name: string
    openingDate: string
    organisationUnitGroups: Array<OrganisationUnitGroup>
    parent: OrganisationUnit
    path: string
    phoneNumber: string
    programs: Array<Program>
    queryMods: QueryModifiers
    sharing: Sharing
    shortName: string
    translations: Array<Translation>
    type: string
    url: string
    user: User
    users: Array<User>
}

export namespace OrganisationUnit {
    export enum aggregationType {
        SUM = 'SUM',
        AVERAGE = 'AVERAGE',
        AVERAGE_SUM_ORG_UNIT = 'AVERAGE_SUM_ORG_UNIT',
        LAST = 'LAST',
        LAST_AVERAGE_ORG_UNIT = 'LAST_AVERAGE_ORG_UNIT',
        LAST_LAST_ORG_UNIT = 'LAST_LAST_ORG_UNIT',
        LAST_IN_PERIOD = 'LAST_IN_PERIOD',
        LAST_IN_PERIOD_AVERAGE_ORG_UNIT = 'LAST_IN_PERIOD_AVERAGE_ORG_UNIT',
        FIRST = 'FIRST',
        FIRST_AVERAGE_ORG_UNIT = 'FIRST_AVERAGE_ORG_UNIT',
        FIRST_FIRST_ORG_UNIT = 'FIRST_FIRST_ORG_UNIT',
        COUNT = 'COUNT',
        STDDEV = 'STDDEV',
        VARIANCE = 'VARIANCE',
        MIN = 'MIN',
        MAX = 'MAX',
        MIN_SUM_ORG_UNIT = 'MIN_SUM_ORG_UNIT',
        MAX_SUM_ORG_UNIT = 'MAX_SUM_ORG_UNIT',
        NONE = 'NONE',
        CUSTOM = 'CUSTOM',
        DEFAULT = 'DEFAULT',
    }
}
