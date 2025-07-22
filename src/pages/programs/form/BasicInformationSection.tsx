import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    CodeField,
    DescriptionField,
    NameField,
    SectionedFormSection,
    ShortNameField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SCHEMA_SECTIONS, SchemaSection } from '../../../lib'
import { ColorAndIconField } from '../../dataElements/fields'

type BasicInformationSectionProps = {
    section: SchemaSection
}
const schemaSection = SCHEMA_SECTIONS.program

export const BasicInformationSection: React.FC<
    BasicInformationSectionProps
> = ({ section }) => (
    <SectionedFormSection name={section.name}>
        <StandardFormSectionTitle>
            {i18n.t('Basic information')}
        </StandardFormSectionTitle>
        <StandardFormSectionDescription>
            {i18n.t('Set up the basic information for this data set.')}
        </StandardFormSectionDescription>
        <StandardFormField>
            <NameField schemaSection={schemaSection} />
        </StandardFormField>

        <StandardFormField>
            <ShortNameField schemaSection={schemaSection} />
        </StandardFormField>

        <StandardFormField>
            <CodeField schemaSection={schemaSection} />
        </StandardFormField>
        <StandardFormField>
            <DescriptionField />
        </StandardFormField>
        <StandardFormField>
            <ColorAndIconField />
        </StandardFormField>
    </SectionedFormSection>
)
