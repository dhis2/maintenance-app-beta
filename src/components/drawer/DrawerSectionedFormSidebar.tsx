import { Button } from '@dhis2/ui'
import cx from 'classnames'
import React, { useMemo } from 'react'
import {
    createSearchParams,
    Link,
    useLocation,
    useSearchParams,
} from 'react-router-dom'
import {
    FORM_SUBSECTION_PARAM_KEY,
    scrollToSection,
    useSectionedFormContext,
    useSelectedSection,
} from '../../lib'
import css from '../sectionedForm/SectionFormSidebar.module.css'

export const DrawerSectionedFormSidebar = ({
    onCancel,
}: {
    onCancel?: () => void
}) => {
    const { sections } = useSectionedFormContext()

    const [selected] = useSelectedSection(FORM_SUBSECTION_PARAM_KEY)

    const items = sections.map((section) => (
        <DrawerSectionedFormSidebarItem
            key={section.name}
            active={selected === section.name}
            sectionName={section.name}
        >
            {section.label}
        </DrawerSectionedFormSidebarItem>
    ))
    return (
        <nav className={cx(css.sidebar, css.sidebarSecondary)}>
            {items}
            <Button onClick={onCancel}>Back</Button>
        </nav>
    )
}

export type SectionedFormSidebarItemProps = {
    children: React.ReactNode
    active: boolean
    sectionName: string
}

export const DrawerSectionedFormSidebarItem = ({
    children,
    active,
    sectionName,
}: SectionedFormSidebarItemProps) => {
    const [searchParams] = useSearchParams()

    // we want to use a link in the list (due to semantic html and accessbility reasons)
    // thus we need to create new SearchParams with the section parameter
    // in case we want to preserve other search-params
    const toWithSectionParam = useMemo(() => {
        const paramsObject = Object.fromEntries(searchParams.entries())
        return createSearchParams({
            ...paramsObject,
            [FORM_SUBSECTION_PARAM_KEY]: sectionName,
        }).toString()
    }, [searchParams, sectionName])

    return (
        <Link
            className={cx(css.listItem, {
                [css.selected]: active,
            })}
            to={{ search: toWithSectionParam }}
            onClick={() => {
                scrollToSection(sectionName)
            }}
        >
            {children}
        </Link>
    )
}
