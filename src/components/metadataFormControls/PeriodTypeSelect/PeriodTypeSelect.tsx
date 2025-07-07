import i18n from '@dhis2/d2-i18n'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { SearchableSingleSelect } from '../../../components'
import { getConstantTranslation } from '../../../lib'
import { useBoundResourceQueryFn } from '../../../lib/query/useBoundQueryFn'

export type PeriodTypes = { periodTypes: [{ name: string }] }

export function PeriodTypeSelect({
    selected,
    invalid,
    onChange,
    noValueOption = false,
    dataTest,
}: {
    selected?: string
    invalid?: boolean
    onChange: (selected: string) => void
    noValueOption?: boolean
    dataTest?: string
}) {
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
        const options = data
            ? data.periodTypes.map((period) => ({
                  label: getConstantTranslation(period.name),
                  value: period.name,
              }))
            : []
        if (noValueOption) {
            options.unshift({
                value: '',
                label: i18n.t('<No value>'),
            })
        }
        return options
    }, [data])

    return (
        <SearchableSingleSelect
            selected={selected}
            invalid={invalid}
            error={error ? i18n.t('Something went wrong') : undefined}
            onChange={({ selected }) => onChange(selected)}
            searchable={false}
            options={options}
            loading={isLoading}
            onRetryClick={refetch}
            showEndLoader={false}
            dataTest={dataTest}
        />
    )
}
