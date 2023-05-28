/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { ConsoleTarget } from './ConsoleTarget'
import type { Eventhook_Source } from './Eventhook_Source'
import type { JmsTarget } from './JmsTarget'
import type { KafkaTarget } from './KafkaTarget'
import type { User } from './User'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'
import type { WebhookTarget } from './WebhookTarget'

export type EventHook = {
    access: Access
    attributeValues: Array<AttributeValue>
    code: string
    created: string
    createdBy: User
    description: string
    disabled: boolean
    displayName: string
    favorite: boolean
    favorites: Array<string>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedBy: User
    name: string
    sharing: Sharing
    source: Eventhook_Source
    targets: Array<WebhookTarget | ConsoleTarget | JmsTarget | KafkaTarget>
    translations: Array<Translation>
    user: User
}
