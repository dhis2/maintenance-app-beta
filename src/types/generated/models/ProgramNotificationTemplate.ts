/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { DataElement } from './DataElement'
import type { TrackedEntityAttribute } from './TrackedEntityAttribute'
import type { User } from './User'
import type { UserGroup } from './UserGroup'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ProgramNotificationTemplate = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    deliveryChannels: Array<'SMS' | 'EMAIL' | 'HTTP'>
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
    notificationRecipient: ProgramNotificationTemplate.notificationRecipient
    notificationTrigger: ProgramNotificationTemplate.notificationTrigger
    notifyParentOrganisationUnitOnly: boolean
    notifyUsersInHierarchyOnly: boolean
    recipientDataElement: DataElement
    recipientProgramAttribute: TrackedEntityAttribute
    recipientUserGroup: UserGroup
    relativeScheduledDays: number
    sendRepeatable: boolean
    sharing: Sharing
    subjectTemplate: string
    translations: Array<Translation>
    user: User
}

export namespace ProgramNotificationTemplate {
    export enum notificationRecipient {
        TRACKED_ENTITY_INSTANCE = 'TRACKED_ENTITY_INSTANCE',
        ORGANISATION_UNIT_CONTACT = 'ORGANISATION_UNIT_CONTACT',
        USERS_AT_ORGANISATION_UNIT = 'USERS_AT_ORGANISATION_UNIT',
        USER_GROUP = 'USER_GROUP',
        PROGRAM_ATTRIBUTE = 'PROGRAM_ATTRIBUTE',
        DATA_ELEMENT = 'DATA_ELEMENT',
        WEB_HOOK = 'WEB_HOOK',
    }

    export enum notificationTrigger {
        ENROLLMENT = 'ENROLLMENT',
        COMPLETION = 'COMPLETION',
        PROGRAM_RULE = 'PROGRAM_RULE',
        SCHEDULED_DAYS_DUE_DATE = 'SCHEDULED_DAYS_DUE_DATE',
        SCHEDULED_DAYS_INCIDENT_DATE = 'SCHEDULED_DAYS_INCIDENT_DATE',
        SCHEDULED_DAYS_ENROLLMENT_DATE = 'SCHEDULED_DAYS_ENROLLMENT_DATE',
    }
}
