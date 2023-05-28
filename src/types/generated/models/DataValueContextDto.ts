/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DataValueAuditDto } from './DataValueAuditDto'
import type { DataValueDto } from './DataValueDto'

export type DataValueContextDto = {
    audits: Array<DataValueAuditDto>
    history: Array<DataValueDto>
}
