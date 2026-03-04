import React from 'react'
import {
    CustomAttributesSection,
    SectionedFormSections,
} from '../../../components'
import {
    SCHEMA_SECTIONS,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { EventProgramFormDescriptor } from './eventProgramFormDescriptor'
import { SetupFormContents } from './SetupFormContents'

export const EventProgramFormContents = () => {
    const descriptor =
        useSectionedFormContext<typeof EventProgramFormDescriptor>()
    useSyncSelectedSectionWithScroll()
    return (
        <SectionedFormSections>
            <SetupFormContents
                name={descriptor.getSection('programDetails').name}
                isTrackerProgram={false}
            />
            {/*<ProgramCustomizationFormContents*/}
            {/*    name={descriptor.getSection('programCustomization').name}*/}
            {/*/>*/}
            {/*<EnrollmentSettingsFormContents*/}
            {/*    name={descriptor.getSection('enrollmentSettings').name}*/}
            {/*/>*/}
            {/*<EnrollmentDataFormContents*/}
            {/*    name={descriptor.getSection('enrollmentData').name}*/}
            {/*/>*/}
            {/*<EnrollmentFormFormContents*/}
            {/*    name={descriptor.getSection('enrollmentForm').name}*/}
            {/*/>*/}
            {/*<ProgramStagesFormContents*/}
            {/*    name={descriptor.getSection('programStages').name}*/}
            {/*/>*/}
            {/*<ProgramNotificationsFormContents*/}
            {/*    name={descriptor.getSection('programNotifications').name}*/}
            {/*/>*/}
            {/*<AccessAndSharingFormContents*/}
            {/*    name={descriptor.getSection('accessAndSharing').name}*/}
            {/*/>*/}
            <CustomAttributesSection
                schemaSection={SCHEMA_SECTIONS.program}
                sectionedLayout
            />
        </SectionedFormSections>
    )
}
