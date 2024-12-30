import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    CustomAttributesSection,
    DefaultIdentifiableFields,
    DescriptionField,
    OrganisationUnitField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SECTIONS_MAP } from '../../../lib'

export const OrganisationalUnitGroupFormFields = () => {
    const section = SECTIONS_MAP.category

    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this organisational unit group set.'
                    )}
                </StandardFormSectionDescription>
                <DefaultIdentifiableFields />
                <StandardFormField>
                    <DescriptionField schemaSection={section} />
                </StandardFormField>
            </StandardFormSection>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    <label htmlFor={'organisationUnitGroups'}>
                        {i18n.t('Organisation units')}
                    </label>
                </StandardFormSectionTitle>
                <StandardFormField>
                    <OrganisationUnitField />
                </StandardFormField>
            </StandardFormSection>
            <CustomAttributesSection schemaSection={section} />
        </>
    )
}
