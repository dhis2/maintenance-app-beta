import React from 'react'
import { SectionedFormSections } from '../../../components/sectionedForm'
import {
    SECTIONS_MAP,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { DataSetFormDescriptor } from './formDescriptor'
import { SetupFormContents } from './SetupFormContents'
import { DataFormContents } from './DataFormContents'
import { PeriodsContents } from './PeriodsFormContents'
import { ValidationFormContents } from './ValidationFormContents'
import { OrganisationUnitsFormContents } from './OrganisationUnitsFormContents'
import { FormFormContents } from './FormFormContents'
import { AdvancedFormContents } from './AdvancedFormContents'

const section = SECTIONS_MAP.dataSet

export const DataSetFormContents = () => {
    const descriptor = useSectionedFormContext<typeof DataSetFormDescriptor>()
    useSyncSelectedSectionWithScroll()
    return (
        <>
            <SectionedFormSections>
                <SetupFormContents name={descriptor.getSection('setup').name} />
                <DataFormContents name={descriptor.getSection('data').name} />
                <PeriodsContents name={descriptor.getSection('periods').name} />
                <ValidationFormContents
                    name={descriptor.getSection('validation').name}
                />
                <OrganisationUnitsFormContents
                    name={descriptor.getSection('validation').name}
                />
                <FormFormContents name={descriptor.getSection('form').name} />
                <AdvancedFormContents
                    name={descriptor.getSection('advanced').name}
                />
            </SectionedFormSections>
        </>
    )
}
