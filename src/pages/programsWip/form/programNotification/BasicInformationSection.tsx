import React from 'react'
import { CodeField, NameField, StandardFormField } from '../../../../components'
import { SchemaSection } from '../../../../lib'

type BasicInformationSectionProps = {
    section: SchemaSection
}

export const BasicInformationSection: React.FC<
    BasicInformationSectionProps
> = ({ section }) => (
    <>
        <StandardFormField>
            <NameField schemaSection={section} />
        </StandardFormField>
        <StandardFormField>
            <CodeField schemaSection={section} />
        </StandardFormField>
    </>
)
