import React from 'react'
import { CustomAttributesSection } from '../../../components'
import { SectionedFormSections } from '../../../components/sectionedForm'
import {
    SECTIONS_MAP,
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { AdvancedFormContents } from './AdvancedFormContents'
import { DataFormContents } from './DataFormContents'
import { DataSetFormDescriptor } from './formDescriptor'
import { FormFormContents } from './FormFormContents'
import { OrganisationUnitsFormContents } from './OrganisationUnitsFormContents'
import { PeriodsContents } from './PeriodsFormContents'
import { SetupFormContents } from './SetupFormContents'
import { ValidationFormContents } from './ValidationFormContents'

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
                <OrganisationUnitsFormContents name={'organisationUnits'} />
                <FormFormContents name={descriptor.getSection('form').name} />
                <AdvancedFormContents
                    name={descriptor.getSection('advanced').name}
                />
                <CustomAttributesSection
                    schemaSection={SECTIONS_MAP.dataSet}
                    sectionedLayout
                />
            </SectionedFormSections>
        </>
    )
}
