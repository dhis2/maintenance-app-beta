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
import { AccessAndSharingFormContents } from '../common/AccessAndSharingFormContents'
import { ProgramNotificationsFormContents } from '../common/ProgramNotificationsFormContents'
import { SetupFormContents } from '../common/SetupFormContents'
import { StageDataFormContents } from '../programStage/StageDataFormContents'
import { StageFormFormContents } from '../programStage/StageFormFormContents'
import { EventProgramCustomizationFormContents } from './EventProgramCustomizationFormContents'
import { EventProgramFormDescriptor } from './eventProgramFormDescriptor'
import { ProgramSettingsFormContents } from './ProgramSettingsFormContents'

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
            <EventProgramCustomizationFormContents
                name={descriptor.getSection('programCustomization').name}
            />
            <ProgramSettingsFormContents
                name={descriptor.getSection('programSettings').name}
            />
            <StageDataFormContents
                name={descriptor.getSection('data').name}
                sectionLabel={i18n.t('Data')}
                isTrackerProgram={false}
            />
            <StageFormFormContents
                name={descriptor.getSection('form').name}
                sectionLabel={i18n.t('Form')}
                isSubsection={false}
                isTrackerProgram={false}
            />
            {/*<ProgramStagesFormContents*/}
            {/*    name={descriptor.getSection('programStages').name}*/}
            {/*/>*/}
            <ProgramNotificationsFormContents
                name={descriptor.getSection('programNotifications').name}
                isTrackerProgram={false}
            />
            <AccessAndSharingFormContents
                name={descriptor.getSection('accessAndSharing').name}
                showStageAccess={false}
            />
            <CustomAttributesSection
                schemaSection={SCHEMA_SECTIONS.program}
                sectionedLayout
            />
        </SectionedFormSections>
    )
}
