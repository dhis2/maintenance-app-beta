/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { Category } from './Category'
import type { CategoryOptionGroupSet } from './CategoryOptionGroupSet'
import type { UserRole } from './UserRole'
import type { Sharing } from './Sharing'

export type UserCredentialsDto = {
    access: Access
    accountExpiry: string
    catDimensionConstraints: Array<Category>
    cogsDimensionConstraints: Array<CategoryOptionGroupSet>
    disabled: boolean
    externalAuth: boolean
    id: string
    idToken: string
    invitation: boolean
    lastLogin: string
    ldapId: string
    openId: string
    password: string
    passwordLastUpdated: string
    previousPasswords: Array<string>
    restoreExpiry: string
    restoreToken: string
    selfRegistered: boolean
    sharing: Sharing
    twoFA: boolean
    uid: string
    userRoles: Array<UserRole>
    username: string
    uuid: string
}
