import i18n from '@dhis2/d2-i18n'
import { RadioFieldFF } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { HorizontalFieldGroup } from '../../form/helpers'

export function FeatureTypeField({
    helpText,
}: {
    helpText?: string
} = {}) {
    const noneField = useField('featureType', { type: 'radio', value: 'NONE' })
    const pointField = useField('featureType', {
        type: 'radio',
        value: 'POINT',
    })
    const polygonField = useField('featureType', {
        type: 'radio',
        value: 'POLYGON',
    })

    return (
        <HorizontalFieldGroup
            label={i18n.t('Location type')}
            dataTest="formfields-featureType"
            helpText={helpText}
        >
            <RadioFieldFF
                label={i18n.t('Point')}
                input={pointField.input}
                meta={pointField.meta}
            />
            <RadioFieldFF
                label={i18n.t('Polygon/Area')}
                input={polygonField.input}
                meta={polygonField.meta}
            />
            <RadioFieldFF
                label={i18n.t('Do not collect location data')}
                input={noneField.input}
                meta={noneField.meta}
            />
        </HorizontalFieldGroup>
    )
}
