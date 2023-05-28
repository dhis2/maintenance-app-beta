/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { User } from './User'
import type { UserGroup } from './UserGroup'
import type { ValidationRule } from './ValidationRule'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ValidationNotificationTemplate = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    displayMessageTemplate: string
    displayName: string
    displaySubjectTemplate: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    messageTemplate: string
    name: string
    notifyParentOrganisationUnitOnly: boolean
    notifyUsersInHierarchyOnly: boolean
    recipientUserGroups: Array<UserGroup>
    sendStrategy: ValidationNotificationTemplate.sendStrategy
    sharing: Sharing
    subjectTemplate: string
    translations: Array<Translation>
    user: User
    validationRules: Array<ValidationRule>
}

export namespace ValidationNotificationTemplate {
    export enum sendStrategy {
        COLLECTIVE_SUMMARY = 'COLLECTIVE_SUMMARY',
        SINGLE_NOTIFICATION = 'SINGLE_NOTIFICATION',
    }
}
