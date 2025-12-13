import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { featureTypeOptions } from '../../../pages/programsWip/form/constants'

export function FeatureTypeField({
    helpText,
    inputWidth = '400px',
}: {
    helpText?: string
    inputWidth?: string
} = {}) {
    const { input, meta } = useField('featureType')
    return (
        <SingleSelectFieldFF
            name="featureType"
            label={i18n.t('Feature type')}
            inputWidth={inputWidth}
            options={featureTypeOptions}
            input={input}
            meta={meta}
            dataTest="formfields-featureType"
            helpText={helpText}
        />
    )
}
