import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    StandardFormField,
} from '../../../components'
import {
    CodeField,
    CompulsoryField,
    DataDimensionField,
    DataElementGroupsField,
    DescriptionField,
    NameField,
    ShortNameField,
} from '../fields'

export function DataElementGroupSetFormFields() {
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the information for this data element group'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <NameField />
                </StandardFormField>

                <StandardFormField>
                    <ShortNameField />
                </StandardFormField>

                <StandardFormField>
                    <CodeField />
                </StandardFormField>

                <StandardFormField>
                    <DescriptionField />
                </StandardFormField>

                <StandardFormField>
                    <CompulsoryField />
                </StandardFormField>

                <StandardFormField>
                    <DataDimensionField />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Data elements')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t('@TODO')}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <DataElementGroupsField />
                </StandardFormField>
            </StandardFormSection>
        </>
    )
}
