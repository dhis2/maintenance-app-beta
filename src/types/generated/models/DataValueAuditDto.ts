/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UID_CategoryOptionCombo } from './UID_CategoryOptionCombo'
import type { UID_DataElement } from './UID_DataElement'
import type { UID_OrganisationUnit } from './UID_OrganisationUnit'

export type DataValueAuditDto = {
    attributeOptionCombo: UID_CategoryOptionCombo
    auditType: DataValueAuditDto.auditType
    categoryOptionCombo: UID_CategoryOptionCombo
    created: string
    dataElement: UID_DataElement
    modifiedBy: string
    orgUnit: UID_OrganisationUnit
    period: string
    value: string
}

export namespace DataValueAuditDto {
    export enum auditType {
        CREATE = 'CREATE',
        UPDATE = 'UPDATE',
        DELETE = 'DELETE',
        READ = 'READ',
        SEARCH = 'SEARCH',
    }
}
