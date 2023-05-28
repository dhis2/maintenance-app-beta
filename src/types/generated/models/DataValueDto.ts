/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DataValueCategoryDto } from './DataValueCategoryDto'
import type { UID_CategoryOptionCombo } from './UID_CategoryOptionCombo'
import type { UID_DataElement } from './UID_DataElement'
import type { UID_DataSet } from './UID_DataSet'
import type { UID_OrganisationUnit } from './UID_OrganisationUnit'

export type DataValueDto = {
    attribute: DataValueCategoryDto
    categoryOptionCombo: UID_CategoryOptionCombo
    comment: string
    created: string
    dataElement: UID_DataElement
    dataSet: UID_DataSet
    followUp: boolean
    force: boolean
    lastUpdated: string
    orgUnit: UID_OrganisationUnit
    period: string
    storedBy: string
    value: string
}
