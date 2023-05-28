/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserInfoSnapshot } from './UserInfoSnapshot'

export type Note = {
    lastUpdated: string
    lastUpdatedBy: UserInfoSnapshot
    note: string
    storedBy: string
    storedDate: string
    value: string
}
