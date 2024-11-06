import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import React, { useMemo, useState } from 'react'
import {
    FORM_SECTION_PARAM_KEY,
    getSectionSearchParam,
    SectionedFormDescriptor,
    useSelectedSection,
} from '../../lib'
import css from './SectionFormSidebar.module.css'
import {
    createSearchParams,
    Link,
    NavLink,
    useParams,
    useSearchParams,
} from 'react-router-dom'

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

    // we want to use a link in the list (due to accessbility reasons)
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

export type FormSidebarFromDescriptor = {
    formDescriptor: SectionedFormDescriptor
}
