import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ExpressionBuilderWithModalField } from '../../../components/metadataFormControls/ExpressionBuilder/ExpressionBuilderWithModalField'

export default function DenominatorFields() {
    return (
        <ExpressionBuilderWithModalField
            fieldName="denominator"
            descriptionFieldName="denominatorDescription"
            modalTitle={i18n.t('Denominator Expression')}
            editButtonText={i18n.t('Edit denominator expression')}
            validationResource="indicators/expression/description"
            helpText={i18n.t(
                'Summarise what this denominator expression measures.'
            )}
        />
    )
}
