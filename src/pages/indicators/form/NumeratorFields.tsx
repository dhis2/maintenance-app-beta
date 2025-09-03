import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ExpressionBuilderWithModalField } from '../../../components/metadataFormControls/ExpressionBuilder/ExpressionBuilderWithModalField'

export default function NumeratorFields() {
    return (
        <ExpressionBuilderWithModalField
            fieldName="numerator"
            descriptionFieldName="numeratorDescription"
            modalTitle={i18n.t('Numerator Expression')}
            editButtonText={i18n.t('Edit numerator expression')}
            validationResource="indicators/expression/description"
            helpText={i18n.t(
                'Summarise what this numerator expression measures.'
            )}
        />
    )
}
