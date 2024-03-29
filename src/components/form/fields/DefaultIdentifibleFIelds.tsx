import React from 'react'
import { useSchemaSectionHandleOrThrow } from '../../../lib'
import { StandardFormField } from '../../standardForm'
import { CodeField } from './CodeField'
import { NameField } from './NameField'
import { ShortNameField } from './ShortNameField'

export const DefaultIdentifiableFields = () => {
    const schemaSection = useSchemaSectionHandleOrThrow()

    return (
        <>
            <StandardFormField>
                <NameField schemaSection={schemaSection} />
            </StandardFormField>

            <StandardFormField>
                <ShortNameField schemaSection={schemaSection} />
            </StandardFormField>

            <StandardFormField>
                <CodeField schemaSection={schemaSection} />
            </StandardFormField>
        </>
    )
}
