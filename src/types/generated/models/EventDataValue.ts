/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserInfoSnapshot } from './UserInfoSnapshot'

export type EventDataValue = {
    created: string
    createdByUserInfo: UserInfoSnapshot
    lastUpdated: string
    lastUpdatedByUserInfo: UserInfoSnapshot
    providedElsewhere: boolean
    storedBy: string
    value: string
}
