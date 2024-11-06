import React from 'react'
import { useSectionedFormDescriptor, useSelectedSection } from '../../lib'
import {
    SectionedFormSidebar,
    SectionedFormSidebarItem,
} from './SectionedFormSidebar'

export const DefaultSectionedFormSidebar = () => {
    const { sections } = useSectionedFormDescriptor()

    const [selected] = useSelectedSection()

    const items = sections.map((section) => (
        <SectionedFormSidebarItem
            key={section.name}
            selected={selected === section.name}
            sectionName={section.name}
        >
            {section.label}
        </SectionedFormSidebarItem>
    ))
    return <SectionedFormSidebar>{items}</SectionedFormSidebar>
}
