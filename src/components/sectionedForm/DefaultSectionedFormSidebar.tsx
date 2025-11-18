import React from 'react'
import {
    useSectionedFormContext,
    useSelectedSectionFromQueryParams,
} from '../../lib'
import {
    SectionedFormSidebar,
    SectionedFormSidebarItem,
} from './SectionedFormSidebar'

export const DefaultSectionedFormSidebar = () => {
    const { sections } = useSectionedFormContext()

    const [selected] = useSelectedSectionFromQueryParams()

    const items = sections.map((section) => (
        <SectionedFormSidebarItem
            key={section.name}
            active={selected === section.name}
            sectionName={section.name}
        >
            {section.label}
        </SectionedFormSidebarItem>
    ))
    return <SectionedFormSidebar>{items}</SectionedFormSidebar>
}
