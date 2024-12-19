import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useSectionListFilter } from '../../../../lib'
import { createFilterDataQuery } from './createFilterDataQuery'
import { ModelFilterSelect } from './ModelFilter'

const query = createFilterDataQuery('dataElements')

export const DataElementFilter = () => {
    const [filter, setFilter] = useSectionListFilter('dataElement')

    const selected = filter?.[0]

    return (
        <ModelFilterSelect
            placeholder={i18n.t('Data element')}
            query={query}
            selected={selected}
            onChange={({ selected }) =>
                setFilter(selected ? [selected] : undefined)
            }
        />
    )
}
