import cx from 'classnames'
import React, { useMemo } from 'react'
import { createSearchParams, Link, useSearchParams } from 'react-router-dom'
import { FORM_SECTION_PARAM_KEY, SectionedFormDescriptor } from '../../lib'
import css from './SectionFormSidebar.module.css'

export const SectionedFormSidebar = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return <nav className={css.sidebar}>{children}</nav>
}

export type SectionedFormSidebarItemProps = {
    children: React.ReactNode
    selected: boolean
    sectionName: string
}

export const SectionedFormSidebarItem = ({
    children,
    selected,
    sectionName,
}: SectionedFormSidebarItemProps) => {
    const [searchParams] = useSearchParams()

    // we want to use a link in the list (due to semantic html and accessbility reasons)
    // thus we need to create new SearchParams with the section parameter
    // in case we want to preserve other search-params
    const toWithSectionParam = useMemo(
        () =>
            createSearchParams({
                ...searchParams,
                [FORM_SECTION_PARAM_KEY]: sectionName,
            }).toString(),
        [searchParams, sectionName]
    )

    return (
        <Link
            className={cx(css.listItem, { [css.selected]: selected })}
            to={{ search: toWithSectionParam }}
        >
            {children}
        </Link>
    )
}
