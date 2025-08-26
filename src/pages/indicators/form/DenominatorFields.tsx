import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ExpressionField } from '../../../components/metadataFormControls/ExpressionBuilder/ExpressionField'

export default function DenominatorFields() {
    return (
        <ExpressionField
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
