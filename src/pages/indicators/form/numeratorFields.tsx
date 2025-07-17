import i18n from '@dhis2/d2-i18n'
import { InputFieldFF, TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { useValidateIndicatorExpressionValidator } from './useFormHooks'

function NumeratorFields() {
    const validateExpression = useValidateIndicatorExpressionValidator()

    return (
        <>
            <StandardFormField>
                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    required
                    name="numeratorDescription"
                    label={i18n.t('Numerator description')}
                />
            </StandardFormField>

            <StandardFormField>
                <FieldRFF<string | undefined>
                    name="numerator"
                    validate={validateExpression}
                >
                    {({ input, meta }) => (
                        <TextAreaFieldFF
                            input={input}
                            meta={meta}
                            inputWidth="400px"
                            required
                            label={i18n.t('Edit numerator')}
                            validationText={meta.error}
                            warning={!!meta.error && meta.touched}
                            rows={4}
                        />
                    )}
                </FieldRFF>
            </StandardFormField>
        </>
    )
}

export default NumeratorFields
