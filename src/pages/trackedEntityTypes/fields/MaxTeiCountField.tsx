import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'

export function MaxTeiCountField() {
    return (
        <Field
            component={InputFieldFF}
            inputWidth="200px"
            name="maxTeiCountToReturn"
            dataTest="formfields-maxteicount"
            type="number"
            min="0"
            label={i18n.t(
                'Maximum number of tracked entity instances to return when searching'
            )}
            format={(value: unknown) => value?.toString()}
            parse={(value: unknown) => {
                if (value === undefined || value === '') {
                    return 0
                }
                return Number.parseInt(value as string, 10)
            }}
        />
    )
}
