/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { DataSet } from './DataSet'
import type { User } from './User'
import type { UserGroup } from './UserGroup'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type DataSetNotificationTemplate = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    dataSetNotificationTrigger: DataSetNotificationTemplate.dataSetNotificationTrigger
    dataSets: Array<DataSet>
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
    notificationRecipient: DataSetNotificationTemplate.notificationRecipient
    notifyParentOrganisationUnitOnly: boolean
    notifyUsersInHierarchyOnly: boolean
    recipientUserGroup: UserGroup
    relativeScheduledDays: number
    sendStrategy: DataSetNotificationTemplate.sendStrategy
    sharing: Sharing
    subjectTemplate: string
    translations: Array<Translation>
    user: User
}

export namespace DataSetNotificationTemplate {
    export enum dataSetNotificationTrigger {
        DATA_SET_COMPLETION = 'DATA_SET_COMPLETION',
        SCHEDULED_DAYS = 'SCHEDULED_DAYS',
    }

    export enum notificationRecipient {
        ORGANISATION_UNIT_CONTACT = 'ORGANISATION_UNIT_CONTACT',
        USER_GROUP = 'USER_GROUP',
    }

    export enum sendStrategy {
        COLLECTIVE_SUMMARY = 'COLLECTIVE_SUMMARY',
        SINGLE_NOTIFICATION = 'SINGLE_NOTIFICATION',
    }
}
