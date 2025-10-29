import React from 'react'
import { SectionedFormSections } from '../../../components'
import {
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { EnrollmentDataFormContents } from './EnrollmentDataFormContents'
import { EnrollmentFormFormContents } from './EnrollmentFormFormContents'
import { EnrollmentSettingsFormContents } from './EnrollmentSettingsFormContents'
import { ProgramFormDescriptor } from './formDescriptor'
import { SetupFormContents } from './SetupFormContents'

export const ProgramFormContents = () => {
    const descriptor = useSectionedFormContext<typeof ProgramFormDescriptor>()
    useSyncSelectedSectionWithScroll()
    return (
        <SectionedFormSections>
            <SetupFormContents
                name={descriptor.getSection('enrollmentDetails').name}
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
        </SectionedFormSections>
    )
}
