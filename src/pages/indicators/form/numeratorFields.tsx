import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ExpressionField } from '../../../components/metadataFormControls/LegendSetTransfer/ExpressionField'
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
                <ExpressionField
                    name="numerator"
                    label={i18n.t('Edit numerator')}
                    validate={validateExpression}
                />
            </StandardFormField>
        </>
    )
}

export default NumeratorFields
