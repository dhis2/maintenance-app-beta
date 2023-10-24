import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import { useQuery } from 'react-query'
import { SelectOnChangeObject } from '../../../types'
import { DataSet } from '../../../types/generated'
import css from './Filters.module.css'
import { useSectionListFilter } from './useSectionListFilter'

type DataSetFilterProps = {
    label: string
    constants: Record<string, string>
    filterKey: string
    filterable?: boolean
}

const fields = ['id', 'displayName', 'code'] as const
type DataSets = {
    result: {
        dataSets: Array<Pick<DataSet, (typeof fields)[number]>>
    }
}

export const DataElementInDataSetFilter = () => {
    const engine = useDataEngine()
    const [filter, setFilter] = useSectionListFilter('dataSetElements')
    const dataSetsQuery = {
        result: {
            resource: 'dataSets',
            params: {
                fields: 'id,displayName',
                // filter: 'dataSetElements.dataSet.id:eq:JpLwMjmd7Un',
                paging: false,
            },
        },
    }
    const { isLoading, isSuccess, data } = useQuery({
        queryKey: [dataSetsQuery],
        queryFn: () => engine.query(dataSetsQuery) as unknown as DataSets,
        select: (data) => data.result.dataSets,
    })

    const options = data?.map((dataSet) => ({
        label: dataSet.displayName,
        value: dataSet.id,
    }))

    return (
        <SingleSelect
            className={css.constantSelectionFilter}
            onChange={({ selected }: SelectOnChangeObject) => {
                setFilter(selected)
            }}
            selected={isSuccess ? filter : ''}
            placeholder={i18n.t('Data set')}
            dense
            filterable={true}
            filterPlaceholder={i18n.t('Type to filter options')}
            noMatchText={i18n.t('No matches')}
            prefix={i18n.t('Data set')}
        >
            <SingleSelectOption key={'all'} label={'All'} value={''} />
            {options?.map(({ label, value }) => (
                <SingleSelectOption key={value} label={label} value={value} />
            ))}
        </SingleSelect>
    )
}
