import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import type { FieldMetaState } from 'react-final-form'

export function PriorityField() {
    const { input, meta } = useField('priority', {
        type: 'number',
        format: (value) => value?.toString(),
        parse: (value?: string) =>
            value === undefined || value === '' ? undefined : parseFloat(value),
    })

    return (
        <InputFieldFF
            input={input}
            meta={meta as unknown as FieldMetaState<string | undefined>}
            dataTest="priority-field"
            inputWidth="120px"
            label={i18n.t('Priority')}
            helpText={i18n.t(
                'Can be 0 or negative. Leave empty if not needed.'
            )}
        />
    )
}
