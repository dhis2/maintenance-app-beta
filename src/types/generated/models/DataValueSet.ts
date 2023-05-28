/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DataValue } from './DataValue'

export type DataValueSet = {
    attributeCategoryOptions: Array<string>
    attributeOptionCombo: string
    categoryOptionComboIdScheme: string
    completeDate: string
    dataElementIdScheme: string
    dataSet: string
    dataSetIdScheme: string
    dataValues: Array<DataValue>
    dryRun: boolean
    idScheme: string
    orgUnit: string
    orgUnitIdScheme: string
    period: string
    strategy: string
}
