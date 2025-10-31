import React from 'react'
import { CustomAttributesSection } from '../../../components'
import { SectionedFormSections } from '../../../components/sectionedForm'
import {
    SECTIONS_MAP,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { TrackedEntityAttributeFormDescriptor } from './formDescriptor'
import { TrackedEntityAttributeFormFields } from './TrackedEntityAttributeFormFields'

export const TrackedEntityAttributeFormContents = () => {
    const descriptor =
        useSectionedFormContext<typeof TrackedEntityAttributeFormDescriptor>()
    useSyncSelectedSectionWithScroll()

    return (
        <SectionedFormSections>
            <TrackedEntityAttributeFormFields
                basicSectionName={descriptor.getSection('basic').name}
                dataCollectionSectionName={
                    descriptor.getSection('dataCollection').name
                }
                dataHandlingSectionName={
                    descriptor.getSection('dataHandling').name
                }
                legendsSectionName={descriptor.getSection('legends').name}
            />
            <CustomAttributesSection
                schemaSection={SECTIONS_MAP.trackedEntityAttribute}
                sectionedLayout
            />
        </SectionedFormSections>
    )
}
