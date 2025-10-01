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
            format={(value: unknown) =>
                (value as number | string | undefined)?.toString() || ''
            }
            parse={(value: unknown) =>
                value ? parseInt(String(value), 10) : 0
            }
        />
    )
}
