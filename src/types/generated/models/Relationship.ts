/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RelationshipItem } from './RelationshipItem'

export type Relationship = {
    bidirectional: boolean
    created: string
    from: RelationshipItem
    lastUpdated: string
    relationship: string
    relationshipName: string
    relationshipType: string
    to: RelationshipItem
}
