/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrganisationUnit } from './OrganisationUnit'
import type { TrackedEntity } from './TrackedEntity'

export type ProgramMessageRecipients = {
    emailAddresses: Array<string>
    organisationUnit: OrganisationUnit
    phoneNumbers: Array<string>
    trackedEntity: TrackedEntity
}
