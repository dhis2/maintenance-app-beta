/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DataValueCategoryDto } from './DataValueCategoryDto'

export type DataSetCompletionDto = {
    attribute: DataValueCategoryDto
    completed: boolean
    dataSet: string
    orgUnit: string
    period: string
}
