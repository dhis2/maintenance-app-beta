/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrganisationUnit } from './OrganisationUnit'
import type { Program } from './Program'
import type { TrackedEntity } from './TrackedEntity'

export type TrackedEntityProgramOwner = {
    organisationUnit: OrganisationUnit
    program: Program
    trackedEntityInstance: TrackedEntity
}
