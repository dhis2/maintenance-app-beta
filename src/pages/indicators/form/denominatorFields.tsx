import i18n from '@dhis2/d2-i18n'
import { InputFieldFF, TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { useValidateIndicatorExpressionField } from './useFormHooks'

function DenominatorFields() {
    const { handleValidateExpression } = useValidateIndicatorExpressionField()
    const validation = useField('denominatorInvalid', {})

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
                <FieldRFF<string | undefined> name="denominator">
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
                            label={i18n.t('Edit denominator')}
                            validationText={
                                validation.input.value &&
                                i18n.t('Invalid denominator expression')
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

export default DenominatorFields
