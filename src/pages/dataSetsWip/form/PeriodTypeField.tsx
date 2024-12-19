import i18n from '@dhis2/d2-i18n'
import { Field, SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { useField } from 'react-final-form'
import { useQuery } from 'react-query'
import { SearchableSingleSelect } from '../../../components'
import { useBoundResourceQueryFn } from '../../../lib/query/useBoundQueryFn'

export type PeriodTypes = { periodTypes: [{ name: string }] }
const periodTypesToTranslatedValues: Record<string, string> = {
    BiMonthly: i18n.t('BiMonthly'),
    BiWeekly: i18n.t('BiWeekly'),
    Daily: i18n.t('Daily'),
    FinancialApril: i18n.t('FinancialApril'),
    FinancialJuly: i18n.t('FinancialJuly'),
    FinancialNov: i18n.t('FinancialNov'),
    FinancialOct: i18n.t('FinancialOct'),
    Monthly: i18n.t('Monthly'),
    Quarterly: i18n.t('Quarterly'),
    QuarterlyNov: i18n.t('QuarterlyNov'),
    SixMonthlyApril: i18n.t('SixMonthlyApril'),
    SixMonthlyNov: i18n.t('SixMonthlyNov'),
    SixMonthly: i18n.t('SixMonthly'),
    TwoYearly: i18n.t('TwoYearly'),
    Weekly: i18n.t('Weekly'),
    WeeklySaturday: i18n.t('WeeklySaturday'),
    WeeklySunday: i18n.t('WeeklySunday'),
    WeeklyThursday: i18n.t('WeeklyThursday'),
    WeeklyWednesday: i18n.t('WeeklyWednesday'),
    Yearly: i18n.t('Yearly'),
}

export function PeriodTypeField() {
    const { input, meta } = useField('periodType')
    const queryFn = useBoundResourceQueryFn()

    const PERIOD_TYPES_QUERY = {
        resource: 'periodTypes',
        params: {
            fields: ['name'],
        },
    }

    const { error, data, isLoading, refetch } = useQuery({
        queryKey: [PERIOD_TYPES_QUERY],
        queryFn: queryFn<PeriodTypes>,
    })

    const options = useMemo(() => {
        return data
            ? data.periodTypes.map((period) => ({
                  label:
                      periodTypesToTranslatedValues[period.name] || period.name,
                  value: period.name,
              }))
            : []
    }, [data])

    return (
        <Field
            required
            name="periodType"
            label={i18n.t('Period type')}
            error={meta.touched && !!meta.error}
            validationText={meta.touched ? meta.error : undefined}
        >
            <SearchableSingleSelect
                selected={input.value}
                invalid={meta.touched && !!meta.error}
                error={error ? i18n.t('Something went wrong') : undefined}
                onChange={({ selected }) => input.onChange(selected)}
                searchable={false}
                options={options}
                loading={isLoading}
                onRetryClick={refetch}
                showEndLoader={false}
            />
        </Field>
    )
}
