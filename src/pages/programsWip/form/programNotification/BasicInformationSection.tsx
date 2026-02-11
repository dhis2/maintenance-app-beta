import React from 'react'
import { CodeField, NameField, StandardFormField } from '../../../../components'
import { SchemaSection } from '../../../../lib'

type BasicInformationSectionProps = {
    section: SchemaSection
    programTemplateId?: string
}

export const BasicInformationSection: React.FC<
    BasicInformationSectionProps
> = ({ section, programTemplateId }) => (
    <>
        <StandardFormField>
            <NameField schemaSection={section} modelId={programTemplateId} />
        </StandardFormField>
        <StandardFormField>
            <CodeField schemaSection={section} modelId={programTemplateId} />
        </StandardFormField>
    </>
)
