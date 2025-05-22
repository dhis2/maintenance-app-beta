import React from 'react'
import {
    useIsFieldValueUnique,
    useSchemaSectionHandleOrThrow,
} from '../../../lib'
import { StandardFormField } from '../../standardForm'
import { CodeField } from './CodeField'
import { NameField } from './NameField'
import { ShortNameField } from './ShortNameField'

export const DefaultIdentifiableFields = () => {
    const schemaSection = useSchemaSectionHandleOrThrow()

    const shouldManuallyCheckNameUniqueness = schemaSection.name === 'dataSet'
    const checkNameDuplicate = useIsFieldValueUnique({
        model: schemaSection.namePlural,
        field: 'name',
    })

    return (
        <>
            <StandardFormField>
                <NameField
                    schemaSection={schemaSection}
                    extraValidator={
                        shouldManuallyCheckNameUniqueness
                            ? checkNameDuplicate
                            : undefined
                    }
                />
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
