import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useSectionListFilter } from '../../../../lib'
import { createFilterDataQuery } from './createFilterDataQuery'
import { ModelFilterSelect } from './ModelFilter'

const query = createFilterDataQuery('programIndicatorGroups')

export const ProgramIndicatorGroupFilter = () => {
    const [filter, setFilter] = useSectionListFilter('programIndicatorGroup')

    const selected = filter?.[0]

    return (
        <ModelFilterSelect
            placeholder={i18n.t('Program indicator group')}
            query={query}
            selected={selected}
            onChange={({ selected }) =>
                setFilter(selected ? [selected] : undefined)
            }
        />
    )
}
