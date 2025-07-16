import i18n from '@dhis2/d2-i18n'
import { InputFieldFF, TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { useValidateIndicatorExpressionField } from './useFormHooks'

function NumeratorFields() {
    const { handleValidateExpression } = useValidateIndicatorExpressionField()
    const validation = useField('numeratorInvalid', {})

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
                <FieldRFF<string | undefined> name="numerator">
                    {({ input, meta }) => (
                        <TextAreaFieldFF
                            input={{
                                ...input,
                                onChange: async (value: string) => {
                                    input.onChange(value)
                                    const invalid =
                                        await handleValidateExpression(value)
                                    validation.input.onChange(invalid)
                                },
                            }}
                            meta={meta}
                            inputWidth="400px"
                            required
                            label={i18n.t('Edit numerator')}
                            validationText={
                                validation.input.value &&
                                i18n.t('Invalid numerator expression')
                            }
                            warning={!!validation.input.value}
                            rows={4}
                        />
                    )}
                </FieldRFF>
            </StandardFormField>
        </>
    )
}

export default NumeratorFields
