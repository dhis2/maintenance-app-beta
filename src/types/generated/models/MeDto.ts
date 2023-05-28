/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Access } from './Access'
import type { FileResource } from './FileResource'
import type { OrganisationUnit } from './OrganisationUnit'
import type { UserGroup } from './UserGroup'
import type { UserRole } from './UserRole'
import type { Sharing } from './Sharing'
import type { Translation } from './Translation'
import type { UserAccess } from './UserAccess'
import type { UserCredentialsDto } from './UserCredentialsDto'
import type { UserGroupAccess } from './UserGroupAccess'

export type MeDto = {
    access: Access
    authorities: Array<string>
    avatar: FileResource
    birthday: string
    created: string
    dataSets: Array<string>
    dataViewOrganisationUnits: Array<OrganisationUnit>
    displayName: string
    education: string
    email: string
    employer: string
    externalAccess: boolean
    facebookMessenger: string
    favorites: Array<string>
    firstName: string
    gender: string
    id: string
    impersonation: string
    interests: string
    introduction: string
    jobTitle: string
    languages: string
    lastUpdated: string
    name: string
    nationality: string
    organisationUnits: Array<OrganisationUnit>
    phoneNumber: string
    programs: Array<string>
    settings: Record<string, string | number | boolean>
    sharing: Sharing
    skype: string
    surname: string
    teiSearchOrganisationUnits: Array<OrganisationUnit>
    telegram: string
    translations: Array<Translation>
    twitter: string
    userAccesses: Array<UserAccess>
    userCredentials: UserCredentialsDto
    userGroupAccesses: Array<UserGroupAccess>
    userGroups: Array<UserGroup>
    userRoles: Array<UserRole>
    username: string
    whatsApp: string
}
