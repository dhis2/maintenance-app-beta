/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CompleteStatusDto } from './CompleteStatusDto'
import type { DataValueDto } from './DataValueDto'
import type { MinMaxValueDto } from './MinMaxValueDto'

export type DataValuesDto = {
    completeStatus: CompleteStatusDto
    dataValues: Array<DataValueDto>
    lockStatus: DataValuesDto.lockStatus
    minMaxValues: Array<MinMaxValueDto>
}

export namespace DataValuesDto {
    export enum lockStatus {
        LOCKED = 'LOCKED',
        APPROVED = 'APPROVED',
        OPEN = 'OPEN',
    }
}
