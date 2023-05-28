/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CategoryOptionCombo } from './CategoryOptionCombo'
import type { DataElement } from './DataElement'
import type { TrackedEntityAttribute } from './TrackedEntityAttribute'

export type SMSCode = {
    code: string
    compulsory: boolean
    dataElement: DataElement
    formula: string
    optionId: CategoryOptionCombo
    trackedEntityAttribute: TrackedEntityAttribute
}
