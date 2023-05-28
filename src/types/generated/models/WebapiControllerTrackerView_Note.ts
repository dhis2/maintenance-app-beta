/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UID_WebapiControllerTrackerView_Note } from './UID_WebapiControllerTrackerView_Note'
import type { WebapiControllerTrackerView_User } from './WebapiControllerTrackerView_User'

export type WebapiControllerTrackerView_Note = {
    createdBy: WebapiControllerTrackerView_User
    note: UID_WebapiControllerTrackerView_Note
    storedAt: string | number
    storedBy: string
    value: string
}
