import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { StandardFormField } from '../../../components'
import { ExpressionBuilderField } from '../../../components/metadataFormControls/ExpressionBuilder/ExpressionBuilderField'

function NumeratorFields() {
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
                <ExpressionBuilderField
                    name="numerator"
                    label={i18n.t('Edit numerator')}
                    validationResource="indicators/expression/description"
                    required
                />
            </StandardFormField>
        </>
    )
}

export default NumeratorFields
