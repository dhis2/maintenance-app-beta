import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ExpressionField } from '../../../components/metadataFormControls/ExpressionBuilder/ExpressionField'
import NumeratorExpressionsidebar from './NumeratorExpressionsidebar'


export default function NumeratorFields() {
    return (

        <ExpressionField
            fieldName="numerator"
            descriptionFieldName="numeratorDescription"
            modalTitle={i18n.t('Numerator Expression')}
            editButtonText={i18n.t('Edit numerator expression')}
            validationResource="indicators/expression/description"
            sidebarComponent={NumeratorExpressionsidebar}
        />

    )
}
