import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useSectionListFilter } from '../../../../lib'
import { createFilterDataQuery } from './createdFilterDataQuery'
import { ModelFilterSelect } from './ModelFilter'

const query = createFilterDataQuery('dataSets')

export const DataSetFilter = () => {
    const [filter, setFilter] = useSectionListFilter('dataSet')

    const selected = filter?.[0]

    return (
        <ModelFilterSelect
            placeholder={i18n.t('Data set')}
            query={query}
            selected={selected}
            onChange={({ selected }) =>
                setFilter(selected ? [selected] : undefined)
            }
        />
    )
}
