import i18n from '@dhis2/d2-i18n'
import { InputFieldFF, TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { useValidateIndicatorExpressionValidator } from './useFormHooks'

function DenominatorFields() {
    const validateExpression = useValidateIndicatorExpressionValidator()

    return (
        <>
            <StandardFormField>
                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    required
                    name="denominatorDescription"
                    label={i18n.t('Denominator description')}
                />
            </StandardFormField>

            <StandardFormField>
                <FieldRFF<string | undefined>
                    name="denominator"
                    validate={validateExpression}
                >
                    {({ input, meta }) => (
                        <TextAreaFieldFF
                            input={input}
                            meta={meta}
                            inputWidth="400px"
                            required
                            label={i18n.t('Edit denominator')}
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

export default DenominatorFields
