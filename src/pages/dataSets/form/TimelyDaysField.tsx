import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { FieldMetaState, useField } from 'react-final-form'

export const TimelyDaysField = () => {
    const fieldName = 'timelyDays'

    const { input, meta } = useField(fieldName, {
        parse: (value?: string) =>
            value === undefined || value === '' ? 0 : parseFloat(value),
        type: 'number',
        format: (value) => value?.toString(),
    })

    return (
        <InputFieldFF
            input={input}
            meta={meta as unknown as FieldMetaState<string | undefined>}
            inputWidth="250px"
            label={i18n.t(
                'Number of days after period to qualify for on time submission'
            )}
            helpText={i18n.t(
                'Submissions made within this many days after the period end qualify as "on time" in reporting rates. Enter 0 to ignore.'
            )}
        />
    )
}
