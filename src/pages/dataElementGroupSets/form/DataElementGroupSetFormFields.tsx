import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    CustomAttributes,
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    StandardFormField,
} from '../../../components'
import {
    DefaultIdentifiableFields,
    DescriptionField,
} from '../../../components/form'
import { SCHEMA_SECTIONS } from '../../../lib'
import {
    CompulsoryField,
    DataDimensionField,
    DataElementGroupsField,
} from '../fields'

const schemaSection = SCHEMA_SECTIONS.dataElementGroupSet

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

                <DefaultIdentifiableFields />

                <StandardFormField>
                    <DescriptionField
                        schemaSection={schemaSection}
                        helpText={i18n.t(
                            'Explain the purpose of this data element group.'
                        )}
                    />
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
                    {i18n.t('Data element groups')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t('@TODO')}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <DataElementGroupsField />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Custom attributes')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t('Custom fields for your DHIS2 instance')}
                </StandardFormSectionDescription>

                <CustomAttributes />
            </StandardFormSection>
        </>
    )
}
