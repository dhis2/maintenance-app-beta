/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DateFilterPeriod = {
    endBuffer: number
    endDate: string
    period: DateFilterPeriod.period
    startBuffer: number
    startDate: string
    type: DateFilterPeriod.type
}

export namespace DateFilterPeriod {
    export enum period {
        TODAY = 'TODAY',
        YESTERDAY = 'YESTERDAY',
        LAST_3_DAYS = 'LAST_3_DAYS',
        LAST_7_DAYS = 'LAST_7_DAYS',
        LAST_14_DAYS = 'LAST_14_DAYS',
        LAST_30_DAYS = 'LAST_30_DAYS',
        LAST_60_DAYS = 'LAST_60_DAYS',
        LAST_90_DAYS = 'LAST_90_DAYS',
        LAST_180_DAYS = 'LAST_180_DAYS',
        THIS_MONTH = 'THIS_MONTH',
        LAST_MONTH = 'LAST_MONTH',
        THIS_BIMONTH = 'THIS_BIMONTH',
        LAST_BIMONTH = 'LAST_BIMONTH',
        THIS_QUARTER = 'THIS_QUARTER',
        LAST_QUARTER = 'LAST_QUARTER',
        THIS_SIX_MONTH = 'THIS_SIX_MONTH',
        LAST_SIX_MONTH = 'LAST_SIX_MONTH',
        WEEKS_THIS_YEAR = 'WEEKS_THIS_YEAR',
        MONTHS_THIS_YEAR = 'MONTHS_THIS_YEAR',
        BIMONTHS_THIS_YEAR = 'BIMONTHS_THIS_YEAR',
        QUARTERS_THIS_YEAR = 'QUARTERS_THIS_YEAR',
        THIS_YEAR = 'THIS_YEAR',
        MONTHS_LAST_YEAR = 'MONTHS_LAST_YEAR',
        QUARTERS_LAST_YEAR = 'QUARTERS_LAST_YEAR',
        LAST_YEAR = 'LAST_YEAR',
        LAST_5_YEARS = 'LAST_5_YEARS',
        LAST_10_YEARS = 'LAST_10_YEARS',
        LAST_12_MONTHS = 'LAST_12_MONTHS',
        LAST_6_MONTHS = 'LAST_6_MONTHS',
        LAST_3_MONTHS = 'LAST_3_MONTHS',
        LAST_6_BIMONTHS = 'LAST_6_BIMONTHS',
        LAST_4_QUARTERS = 'LAST_4_QUARTERS',
        LAST_2_SIXMONTHS = 'LAST_2_SIXMONTHS',
        THIS_FINANCIAL_YEAR = 'THIS_FINANCIAL_YEAR',
        LAST_FINANCIAL_YEAR = 'LAST_FINANCIAL_YEAR',
        LAST_5_FINANCIAL_YEARS = 'LAST_5_FINANCIAL_YEARS',
        LAST_10_FINANCIAL_YEARS = 'LAST_10_FINANCIAL_YEARS',
        THIS_WEEK = 'THIS_WEEK',
        LAST_WEEK = 'LAST_WEEK',
        THIS_BIWEEK = 'THIS_BIWEEK',
        LAST_BIWEEK = 'LAST_BIWEEK',
        LAST_4_WEEKS = 'LAST_4_WEEKS',
        LAST_4_BIWEEKS = 'LAST_4_BIWEEKS',
        LAST_12_WEEKS = 'LAST_12_WEEKS',
        LAST_52_WEEKS = 'LAST_52_WEEKS',
    }

    export enum type {
        RELATIVE = 'RELATIVE',
        ABSOLUTE = 'ABSOLUTE',
    }
}
