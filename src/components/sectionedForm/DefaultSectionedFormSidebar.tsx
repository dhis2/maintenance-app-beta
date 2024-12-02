import React from 'react'
import { useSectionedFormContext, useSelectedSection } from '../../lib'
import {
    SectionedFormSidebar,
    SectionedFormSidebarItem,
} from './SectionedFormSidebar'

export const DefaultSectionedFormSidebar = () => {
    const { sections } = useSectionedFormContext()

    const [selected] = useSelectedSection()

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
