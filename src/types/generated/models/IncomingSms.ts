/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'

export type IncomingSms = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    displayName: string
    favorite: boolean
    favorites: Array<string>
    gatewayid: string
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    originator: string
    receiveddate: string
    sentdate: string
    sharing: Sharing
    smsencoding: IncomingSms.smsencoding
    smsstatus: IncomingSms.smsstatus
    text: string
    translations: Array<Translation>
    user: User
}

export namespace IncomingSms {
    export enum smsencoding {
        ENC7BIT = 'ENC7BIT',
        ENC8BIT = 'ENC8BIT',
        ENCUCS2 = 'ENCUCS2',
        ENCCUSTOM = 'ENCCUSTOM',
    }

    export enum smsstatus {
        INCOMING = 'INCOMING',
        PROCESSING = 'PROCESSING',
        UNHANDLED = 'UNHANDLED',
        FAILED = 'FAILED',
        PROCESSED = 'PROCESSED',
        SENT = 'SENT',
    }
}
