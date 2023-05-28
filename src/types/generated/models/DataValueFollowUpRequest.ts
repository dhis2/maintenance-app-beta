/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DataValueCategoryDto } from './DataValueCategoryDto'
import type { UID_CategoryOptionCombo } from './UID_CategoryOptionCombo'
import type { UID_DataSet } from './UID_DataSet'
import type { UID_OrganisationUnit } from './UID_OrganisationUnit'

export type DataValueFollowUpRequest = {
    attribute: DataValueCategoryDto
    attributeOptionCombo: UID_CategoryOptionCombo
    categoryOptionCombo: UID_CategoryOptionCombo
    dataElement: UID_DataSet
    followup: boolean
    orgUnit: UID_OrganisationUnit
    period: string
}
