import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    ColorAndIconField,
    CodeField,
    DescriptionField,
    NameField,
    ShortNameField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'
import { useSchemaSectionHandleOrThrow } from '../../../lib'

export const SetupFormContents = React.memo(function SetupFormContents({
    name,
}: {
    name: string
}) {
    const schemaSection = useSchemaSectionHandleOrThrow()

    return (
        <SectionedFormSection name={name}>
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
})
