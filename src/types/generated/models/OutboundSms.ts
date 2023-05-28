/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type OutboundSms = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    date: string
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    message: string
    name: string
    recipients: Array<string>
    sender: string
    sharing: Sharing
    status: OutboundSms.status
    subject: string
    translations: Array<Translation>
    user: User
}

export namespace OutboundSms {
    export enum status {
        OUTBOUND = 'OUTBOUND',
        SENT = 'SENT',
        ERROR = 'ERROR',
        PENDING = 'PENDING',
        SCHEDULED = 'SCHEDULED',
        DELIVERED = 'DELIVERED',
        FAILED = 'FAILED',
    }
}
