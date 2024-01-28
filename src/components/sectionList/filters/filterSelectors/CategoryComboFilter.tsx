import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useSectionListFilter } from '../../../../lib'
import { createFilterDataQuery } from './createdFilterDataQuery'
import { ModelFilterSelect } from './ModelFilter'

const query = createFilterDataQuery('categoryCombos')

export const CategoryComboFilter = () => {
    const [filter, setFilter] = useSectionListFilter('categoryCombo')

    const selected = filter?.[0]

    return (
        <ModelFilterSelect
            placeholder={i18n.t('Category combo')}
            query={query}
            selected={selected}
            onChange={({ selected }) =>
                setFilter(selected ? [selected] : undefined)
            }
        />
    )
}
