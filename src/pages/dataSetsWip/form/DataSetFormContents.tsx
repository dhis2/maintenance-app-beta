import React from 'react'
import { SectionedFormSections } from '../../../components/sectionedForm'
import {
    useSectionedFormContext,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { AdvancedFormContents } from './AdvancedFormContents'
import { DataFormContents } from './DataFormContents'
import { DataSetFormValues } from './dataSetFormSchema'
import { DataSetFormDescriptor } from './formDescriptor'
import { FormFormContents } from './FormFormContents'
import { OrganisationUnitsFormContents } from './OrganisationUnitsFormContents'
import { PeriodsContents } from './PeriodsFormContents'
import { SetupFormContents } from './SetupFormContents'
import { ValidationFormContents } from './ValidationFormContents'

export const DataSetFormContents = ({
    formValues,
}: {
    formValues: DataSetFormValues
}) => {
    const descriptor = useSectionedFormContext<typeof DataSetFormDescriptor>()
    useSyncSelectedSectionWithScroll()
    return (
        <>
            <SectionedFormSections>
                <SetupFormContents name={descriptor.getSection('setup').name} />
                <DataFormContents name={descriptor.getSection('data').name} />
                <PeriodsContents
                    name={descriptor.getSection('periods').name}
                    formValues={formValues}
                />
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
