import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { useSchemaSectionHandleOrThrow } from '../../../lib'
import { useValidator } from '../../../lib/models/useFieldValidators'

export const FactorField = () => {
    const fieldName = 'factor'
    const schemaSection = useSchemaSectionHandleOrThrow()
    const validate = useValidator({ schemaSection, property: 'factor' })

    const { input, meta } = useField(fieldName, {
        validate,
        type: 'number',
        format: (value) => value?.toString(),
    })

    return (
        <InputFieldFF
            input={input}
            meta={meta}
            inputWidth="400px"
            label={i18n.t('Factor')}
            required
        />
    )
}
