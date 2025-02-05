import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { FieldMetaState, useField } from 'react-final-form'

export const TimelyDaysField = () => {
    const fieldName = 'timelyDays'

    const { input, meta } = useField(fieldName, {
        parse: (value?: string) =>
            value === undefined || value === '' ? undefined : parseFloat(value),
        type: 'number',
        format: (value) => value?.toString(),
    })

    return (
        <InputFieldFF
            input={input}
            meta={meta as FieldMetaState<string | undefined>}
            inputWidth="250px"
            label={i18n.t(
                'Number of days after period to qualify for on time submission'
            )}
            helpText={i18n.t(
                '"On time" submission rate can be using reporting dates in the Report app. Enter 0 to ignore timely submission.'
            )}
        />
    )
}
