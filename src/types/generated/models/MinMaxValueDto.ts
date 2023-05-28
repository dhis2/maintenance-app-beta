/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UID_CategoryOptionCombo } from './UID_CategoryOptionCombo'
import type { UID_DataElement } from './UID_DataElement'
import type { UID_OrganisationUnit } from './UID_OrganisationUnit'

export type MinMaxValueDto = {
    categoryOptionCombo: UID_CategoryOptionCombo
    dataElement: UID_DataElement
    maxValue: number
    minValue: number
    orgUnit: UID_OrganisationUnit
}
