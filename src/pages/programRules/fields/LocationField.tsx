import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'

const LOCATION_OPTIONS = [
    { label: i18n.t('Feedback'), value: 'FEEDBACK' },
    { label: i18n.t('Indicators'), value: 'INDICATORS' },
]

export function LocationField({ required }: Readonly<{ required?: boolean }>) {
    return (
        <Field
            name="location"
            label={i18n.t('Display widget')}
            component={SingleSelectFieldFF}
            options={LOCATION_OPTIONS}
            required={required}
            filterable
        />
    )
}
