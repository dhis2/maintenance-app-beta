import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    StandardFormField,
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    CustomAttributesSection,
    DefaultIdentifiableFields,
    DescriptionField,
    OrganisationUnitField,
} from '../../../components'
import { DateField } from '../../../components/form/fields/DateField'
import { SECTIONS_MAP } from '../../../lib'

const section = SECTIONS_MAP.categoryOption

export const CategoryOptionFormFields = () => {
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this category option.'
                    )}
                </StandardFormSectionDescription>
                <DefaultIdentifiableFields />

                <StandardFormField>
                    <DescriptionField schemaSection={section} />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormField>
                    <DateField name="startDate" label="Pick a start date" />
                </StandardFormField>
                <StandardFormField>
                    <DateField name="endDate" label="Pick an end date" />
                </StandardFormField>

                <StandardFormField>
                    <OrganisationUnitField />
                </StandardFormField>
            </StandardFormSection>

            <CustomAttributesSection />
        </>
    )
}
