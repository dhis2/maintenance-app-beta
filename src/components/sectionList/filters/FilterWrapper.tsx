import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { useSectionListFilters } from './../../../lib'
import { DynamicFilters } from './filterSelectors/DynamicFilters'
import { IdentifiableFilter } from './filterSelectors/IdentifiableFilter'
import css from './FilterWrapper.module.css'

export const FilterWrapper = () => {
    const [filters, setFilters] = useSectionListFilters()
    const hasActiveFilters = Object.values(filters).some(
        (value) => value != null && (!Array.isArray(value) || value.length > 0)
    )

    return (
        <div className={css.filterWrapper} data-test="filters-wrapper">
            <IdentifiableFilter />
            <DynamicFilters />
            {hasActiveFilters && (
                <Button
                    small
                    onClick={() => setFilters(undefined)}
                    dataTest="clear-all-filters-button"
                >
                    {i18n.t('Clear all filters')}
                </Button>
            )}
        </div>
    )
}
