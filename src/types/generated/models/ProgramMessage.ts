/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { ProgramMessageRecipients } from './ProgramMessageRecipients'
import type { Event } from './Event'
import type { Ref_Program_Enrollment } from './Ref_Program_Enrollment'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type ProgramMessage = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    deliveryChannels: Array<'SMS' | 'EMAIL' | 'HTTP'>
    displayName: string
    enrollment: Ref_Program_Enrollment
    event: Event
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    messageStatus: ProgramMessage.messageStatus
    name: string
    notificationTemplate: string
    processedDate: string
    recipients: ProgramMessageRecipients
    sharing: Sharing
    storeCopy: boolean
    subject: string
    text: string
    translations: Array<Translation>
    user: User
}

export namespace ProgramMessage {
    export enum messageStatus {
        SENT = 'SENT',
        FAILED = 'FAILED',
        SCHEDULED = 'SCHEDULED',
        OUTBOUND = 'OUTBOUND',
    }
}
