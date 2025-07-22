import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ExpressionField } from '../../../components/metadataFormControls/LegendSetTransfer/ExpressionField'
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
                <ExpressionField
                    name="denominator"
                    label={i18n.t('Edit denominator')}
                    validate={validateExpression}
                />
            </StandardFormField>
        </>
    )
}

export default DenominatorFields
