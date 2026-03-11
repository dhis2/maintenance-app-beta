import React from 'react'
import {
    CustomAttributesSection,
    SectionedFormSections,
} from '../../../../components'
import {
    SCHEMA_SECTIONS,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../../lib'
import { AccessAndSharingFormContents } from '../common/AccessAndSharingFormContents'
import { ProgramNotificationsFormContents } from '../common/ProgramNotificationsFormContents'
import { SetupFormContents } from '../common/SetupFormContents'
import { EnrollmentFormFormContents } from '../EnrollmentFormFormContents'
import { EnrollmentSettingsFormContents } from '../EnrollmentSettingsFormContents'
import { ProgramCustomizationFormContents } from '../ProgramCustomizationFormContents'
import { ProgramStagesFormContents } from '../ProgramStagesFormContents'
import { EnrollmentDataFormContents } from './EnrollmentDataFormContents'
import { TrackerProgramFormDescriptor } from './trackerProgramFormDescriptor'

export const TrackerProgramFormContents = () => {
    const descriptor =
        useSectionedFormContext<typeof TrackerProgramFormDescriptor>()
    useSyncSelectedSectionWithScroll()
    return (
        <SectionedFormSections>
            <SetupFormContents
                name={descriptor.getSection('programDetails').name}
            ></SetupFormContents>
            <ProgramCustomizationFormContents
                name={descriptor.getSection('programCustomization').name}
            />
            <EnrollmentSettingsFormContents
                name={descriptor.getSection('enrollmentSettings').name}
            />
            <EnrollmentDataFormContents
                name={descriptor.getSection('enrollmentData').name}
            />
            <EnrollmentFormFormContents
                name={descriptor.getSection('enrollmentForm').name}
            />
            <ProgramStagesFormContents
                name={descriptor.getSection('programStages').name}
            />
            <ProgramNotificationsFormContents
                name={descriptor.getSection('programNotifications').name}
            />
            <AccessAndSharingFormContents
                name={descriptor.getSection('accessAndSharing').name}
            />
            <CustomAttributesSection
                schemaSection={SCHEMA_SECTIONS.program}
                sectionedLayout
            />
        </SectionedFormSections>
    )
}
