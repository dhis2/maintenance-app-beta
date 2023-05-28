/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserAccess } from './UserAccess'
import type { UserGroupAccess } from './UserGroupAccess'

export type Sharing = {
    external: boolean
    owner: string
    public: string
    userGroups: Record<string, UserGroupAccess>
    users: Record<string, UserAccess>
}
