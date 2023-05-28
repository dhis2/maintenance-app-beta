/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { AttributeValue } from './AttributeValue'
import type { Category } from './Category'
import type { CategoryOptionGroupSet } from './CategoryOptionGroupSet'
import type { FileResource } from './FileResource'
import type { OrganisationUnit } from './OrganisationUnit'
import type { UserGroup } from './UserGroup'
import type { UserRole } from './UserRole'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'
import type { UserCredentialsDto } from './UserCredentialsDto'
import type { UserSettings } from './UserSettings'

export type User = {
    access: Access
    accountExpiry: string
    attributeValues: Array<AttributeValue>
    avatar: FileResource
    birthday: string
    catDimensionConstraints: Array<Category>
    code: string
    cogsDimensionConstraints: Array<CategoryOptionGroupSet>
    created: string
    createdBy: User
    dataViewMaxOrganisationUnitLevel: number
    dataViewOrganisationUnits: Array<OrganisationUnit>
    disabled: boolean
    displayName: string
    education: string
    email: string
    employer: string
    externalAuth: boolean
    facebookMessenger: string
    favorite: boolean
    favorites: Array<string>
    firstName: string
    gender: string
    href: string
    id: string
    interests: string
    introduction: string
    invitation: boolean
    jobTitle: string
    languages: string
    lastCheckedInterpretations: string
    lastLogin: string
    lastUpdated: string
    lastUpdatedBy: User
    ldapId: string
    nationality: string
    openId: string
    organisationUnits: Array<OrganisationUnit>
    password: string
    passwordLastUpdated: string
    phoneNumber: string
    selfRegistered: boolean
    settings: UserSettings
    sharing: Sharing
    skype: string
    surname: string
    teiSearchOrganisationUnits: Array<OrganisationUnit>
    telegram: string
    translations: Array<Translation>
    twitter: string
    twoFactorEnabled: boolean
    user: User
    userCredentials: UserCredentialsDto
    userGroups: Array<UserGroup>
    userRoles: Array<UserRole>
    username: string
    welcomeMessage: string
    whatsApp: string
}
