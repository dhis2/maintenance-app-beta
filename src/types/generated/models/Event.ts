/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { EventDataValue } from './EventDataValue'
import type { CategoryOptionCombo } from './CategoryOptionCombo'
import type { MessageConversation } from './MessageConversation'
import type { OrganisationUnit } from './OrganisationUnit'
import type { Ref_Program_Enrollment } from './Ref_Program_Enrollment'
import type { ProgramStage } from './ProgramStage'
import type { Ref_TrackedEntityComment } from './Ref_TrackedEntityComment'
import type { User } from './User'
import type { Relationship_RelationshipItem } from './Relationship_RelationshipItem'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'
import type { UserInfoSnapshot } from './UserInfoSnapshot'

export type Event = {
    access: Access
    assignedUser: User
    attributeOptionCombo: CategoryOptionCombo
    attributeValues: Array<AttributeValue>
    code: string
    comments: Array<Ref_TrackedEntityComment>
    completed: boolean
    completedBy: string
    completedDate: string
    creatableInSearchScope: boolean
    created: string
    createdAtClient: string
    createdBy: User
    createdByUserInfo: UserInfoSnapshot
    deleted: boolean
    displayName: string
    dueDate: string
    enrollment: Ref_Program_Enrollment
    eventDataValues: Array<EventDataValue>
    eventDate: string
    favorite: boolean
    favorites: Array<string>
    geometry: Record<string, any>
    href: string
    id: string
    lastUpdated: string
    lastUpdatedAtClient: string
    lastUpdatedBy: User
    lastUpdatedByUserInfo: UserInfoSnapshot
    messageConversations: Array<MessageConversation>
    name: string
    organisationUnit: OrganisationUnit
    programStage: ProgramStage
    relationshipItems: Array<Relationship_RelationshipItem>
    sharing: Sharing
    status: Event.status
    storedBy: string
    translations: Array<Translation>
    user: User
}

export namespace Event {
    export enum status {
        ACTIVE = 'ACTIVE',
        COMPLETED = 'COMPLETED',
        VISITED = 'VISITED',
        SCHEDULE = 'SCHEDULE',
        OVERDUE = 'OVERDUE',
        SKIPPED = 'SKIPPED',
    }
}
