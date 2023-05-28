/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { Ref_Message } from './Ref_Message'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'
import type { UserMessage } from './UserMessage'

export type MessageConversation = {
    access: Access
    assignee: User
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    displayName: string
    extMessageId: string
    favorite: boolean
    favorites: Array<string>
    followUp: boolean
    href: string
    id: string
    lastMessage: string
    lastSender: User
    lastSenderFirstname: string
    lastSenderSurname: string
    lastUpdated: string
    lastUpdatedBy: User
    messageCount: number
    messageType: MessageConversation.messageType
    messages: Array<Ref_Message>
    priority: MessageConversation.priority
    read: boolean
    sharing: Sharing
    status: MessageConversation.status
    subject: string
    translations: Array<Translation>
    user: User
    userFirstname: string
    userMessages: Array<UserMessage>
    userSurname: string
}

export namespace MessageConversation {
    export enum messageType {
        PRIVATE = 'PRIVATE',
        SYSTEM = 'SYSTEM',
        VALIDATION_RESULT = 'VALIDATION_RESULT',
        TICKET = 'TICKET',
        SYSTEM_VERSION_UPDATE = 'SYSTEM_VERSION_UPDATE',
    }

    export enum priority {
        NONE = 'NONE',
        LOW = 'LOW',
        MEDIUM = 'MEDIUM',
        HIGH = 'HIGH',
    }

    export enum status {
        NONE = 'NONE',
        OPEN = 'OPEN',
        PENDING = 'PENDING',
        INVALID = 'INVALID',
        SOLVED = 'SOLVED',
    }
}
