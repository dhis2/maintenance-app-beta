/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ApprovalDto } from './ApprovalDto'

export type ApprovalsDto = {
    approvals: Array<ApprovalDto>
    ds: Array<Record<string, any>>
    pe: Array<string>
    wf: Array<Record<string, any>>
}
