/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrgUnitInfo } from './OrgUnitInfo'
import type { ProfileItem } from './ProfileItem'

export type OrgUnitProfileData = {
    attributes: Array<ProfileItem>
    dataItems: Array<ProfileItem>
    groupSets: Array<ProfileItem>
    info: OrgUnitInfo
}
