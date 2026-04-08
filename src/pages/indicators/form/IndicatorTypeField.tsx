import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ModelSingleSelectRefreshableFormField } from '../../../components/metadataFormControls/ModelSingleSelect/ModelSingleSelectRefrashebleField'
import { required } from '../../../lib'

type IndicatorTypeFieldsProps = {
    helpText?: string
}

export const IndicatorTypeField = ({ helpText }: IndicatorTypeFieldsProps) => {
    return (
        <ModelSingleSelectRefreshableFormField
            required
            dataTest="formfields-indicatortype"
            name="indicatorType"
            helpText={helpText}
            label={i18n.t('Indicator type')}
            validate={required}
            query={{
                resource: 'indicatorTypes',
                params: {
                    fields: ['id', 'displayName'],
                    order: 'displayName:iasc',
                },
            }}
            refreshResource="indicatorTypes"
        />
    )
}
