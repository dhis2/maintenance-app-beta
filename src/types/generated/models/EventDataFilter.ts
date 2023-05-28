/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DateFilterPeriod } from './DateFilterPeriod'

export type EventDataFilter = {
    dataItem: string
    dateFilter: DateFilterPeriod
    eq: string
    ge: string
    gt: string
    in: Array<string>
    le: string
    like: string
    lt: string
}
