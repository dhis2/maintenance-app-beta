/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DataApprovalPermissions } from './DataApprovalPermissions'
import type { UID_CategoryOptionCombo } from './UID_CategoryOptionCombo'
import type { UID_DataApprovalWorkflow } from './UID_DataApprovalWorkflow'
import type { UID_OrganisationUnit } from './UID_OrganisationUnit'

export type ApprovalStatusDto = {
    aoc: UID_CategoryOptionCombo
    level: string
    ou: UID_OrganisationUnit
    ouName: string
    pe: string
    permissions: DataApprovalPermissions
    state: ApprovalStatusDto.state
    wf: UID_DataApprovalWorkflow
}

export namespace ApprovalStatusDto {
    export enum state {
        UNAPPROVABLE = 'UNAPPROVABLE',
        UNAPPROVED_ABOVE = 'UNAPPROVED_ABOVE',
        UNAPPROVED_WAITING = 'UNAPPROVED_WAITING',
        UNAPPROVED_READY = 'UNAPPROVED_READY',
        APPROVED_ABOVE = 'APPROVED_ABOVE',
        APPROVED_HERE = 'APPROVED_HERE',
        ACCEPTED_HERE = 'ACCEPTED_HERE',
    }
}
