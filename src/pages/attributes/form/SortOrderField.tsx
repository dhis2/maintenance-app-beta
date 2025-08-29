import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { FieldMetaState, useField } from 'react-final-form'

export const SortOrderField = () => {
    const fieldName = 'sortOrder'

    const { input, meta } = useField(fieldName, {
        parse: (value?: string) =>
            value === undefined || value === '' ? 0 : parseFloat(value),
        type: 'number',
        format: (value) => value?.toString(),
    })

    return (
        <InputFieldFF
            dataTest="formfields-sortOrder"
            input={input}
            meta={meta as unknown as FieldMetaState<string | undefined>}
            inputWidth="250px"
            label={i18n.t('Sort order')}
            helpText={i18n.t(
                'Enter a number to decide where this attribute appears in list and forms'
            )}
        />
    )
}
