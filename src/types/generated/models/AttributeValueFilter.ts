/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DateFilterPeriod } from './DateFilterPeriod'

export type AttributeValueFilter = {
    attribute: string
    dateFilter: DateFilterPeriod
    eq: string
    ew: string
    ge: string
    gt: string
    in: Array<string>
    le: string
    like: string
    lt: string
    sw: string
}
