import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useSectionListFilter } from '../../../../lib'
import { createFilterDataQuery } from './createFilterDataQuery'
import { ModelFilterSelect } from './ModelFilter'

const query = createFilterDataQuery('dataElementGroupSets')

export const DataElementGroupSetFilter = () => {
    const [filter, setFilter] = useSectionListFilter('dataElementGroupSet')

    const selected = filter?.[0]

    return (
        <ModelFilterSelect
            placeholder={i18n.t('Data element group set')}
            query={query}
            selected={selected}
            onChange={({ selected }) =>
                setFilter(selected ? [selected] : undefined)
            }
        />
    )
}
