import React from 'react'
import { StandardFormField } from '../../../components'
import { SchemaSection } from '../../../lib'
import { MessageTemplateField, SubjectTemplateField } from './TemplateFields'

type Props = {
    section: SchemaSection
}

export const MessageTemplateContent: React.FC<Props> = ({ section }) => (
    <>
        <StandardFormField>
            <SubjectTemplateField schemaSection={section} />
        </StandardFormField>
        <StandardFormField>
            <MessageTemplateField schemaSection={section} />
        </StandardFormField>
    </>
)
