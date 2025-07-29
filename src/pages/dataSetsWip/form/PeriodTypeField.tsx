import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { PeriodTypeSelect } from '../../../components/metadataFormControls/PeriodTypeSelect/PeriodTypeSelect'

export function PeriodTypeField() {
    const { input, meta } = useField('periodType')

    return (
        <Field
            required
            name="periodType"
            label={i18n.t('Period type')}
            error={meta.touched && !!meta.error}
            validationText={meta.touched ? meta.error : undefined}
        >
            <PeriodTypeSelect
                selected={input.value}
                invalid={meta.touched && !!meta.error}
                onChange={input.onChange}
            />
        </Field>
    )
}
