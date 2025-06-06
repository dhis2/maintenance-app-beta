import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { useSectionListFilters } from './../../../lib'
import { DynamicFilters } from './filterSelectors/DynamicFilters'
import { IdentifiableFilter } from './filterSelectors/IdentifiableFilter'
import css from './FilterWrapper.module.css'

export const FilterWrapper = () => {
    const [, setFilters] = useSectionListFilters()

    const handleClear = () => {
        setFilters(undefined)
    }

    return (
        <div className={css.filterWrapper} data-test="filters-wrapper">
            <IdentifiableFilter />
            <DynamicFilters />
            <Button
                small
                onClick={handleClear}
                dataTest="clear-all-filters-button"
            >
                {i18n.t('Clear all filters')}
            </Button>
        </div>
    )
}
