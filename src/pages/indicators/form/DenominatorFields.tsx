import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ExpressionBuilderField } from '../../../components/metadataFormControls/ExpressionBuilder/ExpressionBuilderField'
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
                <ExpressionBuilderField
                    name="denominator"
                    label={i18n.t('Edit denominator')}
                    validate={validateExpression}
                    required
                />
            </StandardFormField>
        </>
    )
}

export default DenominatorFields
