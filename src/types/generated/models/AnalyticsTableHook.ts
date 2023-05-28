/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type AnalyticsTableHook = {
    access: Access
    analyticsTableType: AnalyticsTableHook.analyticsTableType
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    phase: AnalyticsTableHook.phase
    resourceTableType: AnalyticsTableHook.resourceTableType
    sharing: Sharing
    sql: string
    translations: Array<Translation>
    user: User
}

export namespace AnalyticsTableHook {
    export enum analyticsTableType {
        DATA_VALUE = 'DATA_VALUE',
        COMPLETENESS = 'COMPLETENESS',
        COMPLETENESS_TARGET = 'COMPLETENESS_TARGET',
        ORG_UNIT_TARGET = 'ORG_UNIT_TARGET',
        EVENT = 'EVENT',
        ENROLLMENT = 'ENROLLMENT',
        OWNERSHIP = 'OWNERSHIP',
        VALIDATION_RESULT = 'VALIDATION_RESULT',
        TRACKED_ENTITY_INSTANCE_EVENTS = 'TRACKED_ENTITY_INSTANCE_EVENTS',
        TRACKED_ENTITY_INSTANCE_ENROLLMENTS = 'TRACKED_ENTITY_INSTANCE_ENROLLMENTS',
        TRACKED_ENTITY_INSTANCE = 'TRACKED_ENTITY_INSTANCE',
    }

    export enum phase {
        RESOURCE_TABLE_POPULATED = 'RESOURCE_TABLE_POPULATED',
        ANALYTICS_TABLE_POPULATED = 'ANALYTICS_TABLE_POPULATED',
    }

    export enum resourceTableType {
        ORG_UNIT_STRUCTURE = 'ORG_UNIT_STRUCTURE',
        DATA_SET_ORG_UNIT_CATEGORY = 'DATA_SET_ORG_UNIT_CATEGORY',
        CATEGORY_OPTION_COMBO_NAME = 'CATEGORY_OPTION_COMBO_NAME',
        DATA_ELEMENT_GROUP_SET_STRUCTURE = 'DATA_ELEMENT_GROUP_SET_STRUCTURE',
        INDICATOR_GROUP_SET_STRUCTURE = 'INDICATOR_GROUP_SET_STRUCTURE',
        ORG_UNIT_GROUP_SET_STRUCTURE = 'ORG_UNIT_GROUP_SET_STRUCTURE',
        CATEGORY_STRUCTURE = 'CATEGORY_STRUCTURE',
        DATA_ELEMENT_STRUCTURE = 'DATA_ELEMENT_STRUCTURE',
        PERIOD_STRUCTURE = 'PERIOD_STRUCTURE',
        DATE_PERIOD_STRUCTURE = 'DATE_PERIOD_STRUCTURE',
        DATA_ELEMENT_CATEGORY_OPTION_COMBO = 'DATA_ELEMENT_CATEGORY_OPTION_COMBO',
        DATA_APPROVAL_REMAP_LEVEL = 'DATA_APPROVAL_REMAP_LEVEL',
        DATA_APPROVAL_MIN_LEVEL = 'DATA_APPROVAL_MIN_LEVEL',
    }
}
