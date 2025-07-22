import React from 'react'
import { SectionedFormSections } from '../../../../components'
import {
    SCHEMA_SECTIONS,
    useSectionedFormContext,
    useSelectedSection,
} from '../../../../lib'
import { BasicInformationSection } from '../BasicInformationSection'
import { EventProgramFormDescriptor } from './formDescriptor'

export const TrackerProgramFormContents = () => {
    const context = useSectionedFormContext<typeof EventProgramFormDescriptor>()

    const [selectedSection] = useSelectedSection()
    return (
        <SectionedFormSections>
            {selectedSection === context.getSection('basic').name && (
                <BasicInformationSection section={SCHEMA_SECTIONS.program} />
            )}
        </SectionedFormSections>
    )
}
