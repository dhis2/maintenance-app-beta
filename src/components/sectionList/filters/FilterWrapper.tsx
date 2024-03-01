import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { useSectionListFilters } from './../../../lib'
import css from './Filters.module.css'
import { IdentifiableFilter } from './IdentifiableFilter'

type FilterWrapperProps = React.PropsWithChildren

export const FilterWrapper = ({ children }: FilterWrapperProps) => {
    const [, setFilters] = useSectionListFilters()

    const handleClear = () => {
        setFilters(undefined)
    }

    return (
        <div className={css.filterWrapper}>
            <IdentifiableFilter />
            {children}
            <Button small onClick={handleClear}>
                {i18n.t('Clear all filters')}
            </Button>
        </div>
    )
}
