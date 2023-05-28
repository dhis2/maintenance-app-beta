/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Dxf2DeprecatedTrackerTrackedentity_Attribute } from './Dxf2DeprecatedTrackerTrackedentity_Attribute'
import type { Enrollment } from './Enrollment'
import type { ProgramOwner } from './ProgramOwner'
import type { Relationship } from './Relationship'
import type { UserInfoSnapshot } from './UserInfoSnapshot'

export type TrackedEntityInstance = {
    attributes: Array<Dxf2DeprecatedTrackerTrackedentity_Attribute>
    coordinates: string
    created: string
    createdAtClient: string
    createdByUserInfo: UserInfoSnapshot
    deleted: boolean
    enrollments: Array<Enrollment>
    featureType: TrackedEntityInstance.featureType
    geometry: Record<string, any>
    inactive: boolean
    lastUpdated: string
    lastUpdatedAtClient: string
    lastUpdatedByUserInfo: UserInfoSnapshot
    orgUnit: string
    potentialDuplicate: boolean
    programOwners: Array<ProgramOwner>
    relationships: Array<Relationship>
    storedBy: string
    trackedEntityInstance: string
    trackedEntityType: string
}

export namespace TrackedEntityInstance {
    export enum featureType {
        NONE = 'NONE',
        MULTI_POLYGON = 'MULTI_POLYGON',
        POLYGON = 'POLYGON',
        POINT = 'POINT',
        SYMBOL = 'SYMBOL',
    }
}
