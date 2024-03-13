import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    StandardFormField,
    CustomAttributesSection,
} from '../../../components'
import {
    DefaultIdentifiableFields,
    DescriptionField,
} from '../../../components/form'
import { SCHEMA_SECTIONS } from '../../../lib'
import { DataElementsField } from '../fields'

const schemaSection = SCHEMA_SECTIONS.dataElementGroup

export function DataElementGroupFormFields() {
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

                <DefaultIdentifiableFields />

                <StandardFormField>
                    <DescriptionField
                        schemaSection={schemaSection}
                        helpText={i18n.t(
                            'Explain the purpose of this data element group.'
                        )}
                    />
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
                    <DataElementsField />
                </StandardFormField>
            </StandardFormSection>

            <CustomAttributesSection />
        </>
    )
}
