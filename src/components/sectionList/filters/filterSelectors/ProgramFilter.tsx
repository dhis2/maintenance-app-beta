import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useSectionListFilter } from '../../../../lib'
import { createFilterDataQuery } from './createFilterDataQuery'
import { ModelFilterSelect } from './ModelFilter'

const query = createFilterDataQuery('programs')

export const ProgramFilter = () => {
    const [filter, setFilter] = useSectionListFilter('program')

    const selected = filter?.[0]

    return (
        <ModelFilterSelect
            placeholder={i18n.t('Program')}
            query={query}
            selected={selected}
            onChange={({ selected }) =>
                setFilter(selected ? [selected] : undefined)
            }
        />
    )
}
