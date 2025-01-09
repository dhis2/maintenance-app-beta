import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { useField } from 'react-final-form'
import { useQuery } from 'react-query'
import { SearchableSingleSelect } from '../../../components'
import { getConstantTranslation } from '../../../lib'
import { useBoundResourceQueryFn } from '../../../lib/query/useBoundQueryFn'

export type PeriodTypes = { periodTypes: [{ name: string }] }

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
                  label: getConstantTranslation(period.name),
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
