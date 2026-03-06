import i18n from '@dhis2/d2-i18n'
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
import { ProgramNotificationsFormContents } from '../common/ProgramNotificationsFormContents'
import { SetupFormContents } from '../common/SetupFormContents'
import { StageDataFormContents } from '../common/StageDataFormContents'
import { EventProgramFormDescriptor } from './eventProgramFormDescriptor'

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
            <StageDataFormContents
                name={descriptor.getSection('data').name}
                sectionLabel={i18n.t('Data')}
                isTrackerProgram={false}
            />

            {/*<EnrollmentFormFormContents*/}
            {/*    name={descriptor.getSection('enrollmentForm').name}*/}
            {/*/>*/}
            {/*<ProgramStagesFormContents*/}
            {/*    name={descriptor.getSection('programStages').name}*/}
            {/*/>*/}
            <ProgramNotificationsFormContents
                name={descriptor.getSection('programNotifications').name}
                isTrackerProgram={false}
            />
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
