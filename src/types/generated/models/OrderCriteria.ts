/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type OrderCriteria = {
    direction: OrderCriteria.direction
    field: string
}

export namespace OrderCriteria {
    export enum direction {
        ASC = 'ASC',
        DESC = 'DESC',
        IASC = 'IASC',
        IDESC = 'IDESC',
    }
}
