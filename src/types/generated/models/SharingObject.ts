/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SharingUser } from './SharingUser'
import type { SharingUserAccess } from './SharingUserAccess'
import type { SharingUserGroupAccess } from './SharingUserGroupAccess'

export type SharingObject = {
    displayName: string
    externalAccess: boolean
    id: string
    name: string
    publicAccess: string
    user: SharingUser
    userAccesses: Array<SharingUserAccess>
    userGroupAccesses: Array<SharingUserGroupAccess>
}
