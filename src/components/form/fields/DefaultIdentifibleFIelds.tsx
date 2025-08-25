import React from 'react'
import { useSchemaSectionHandleOrThrow } from '../../../lib'
import { StandardFormField } from '../../standardForm'
import { CodeField } from './CodeField'
import { NameField } from './NameField'
import { ShortNameField } from './ShortNameField'

type DefaultIdentifiableFieldsProps = {
    shortNameHelpText?: string
    shortNameIsRequired?: boolean
}
export const DefaultIdentifiableFields = ({
    shortNameHelpText,
    shortNameIsRequired,
}: DefaultIdentifiableFieldsProps) => {
    const schemaSection = useSchemaSectionHandleOrThrow()

    return (
        <>
            <StandardFormField>
                <NameField schemaSection={schemaSection} />
            </StandardFormField>

            <StandardFormField>
                <ShortNameField
                    schemaSection={schemaSection}
                    helpText={shortNameHelpText}
                    isRequired={shortNameIsRequired}
                />
            </StandardFormField>

            <StandardFormField>
                <CodeField schemaSection={schemaSection} />
            </StandardFormField>
        </>
    )
}
