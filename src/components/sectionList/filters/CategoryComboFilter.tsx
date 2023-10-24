import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { CategoryComboSelect } from '../../metadataFormControls'
import css from './Filters.module.css'
import { useSectionListFilter } from './useSectionListFilter'

export const CategoryComboFilter = () => {
    const [filter, setFilter] = useSectionListFilter('categoryCombo')

    return (
        <div className={css.constantSelectionFilter}>
            <CategoryComboSelect
                prefix={i18n.t('Category combo')}
                selected={filter}
                onChange={({ selected }) => setFilter(selected)}
            />
        </div>
    )
}
