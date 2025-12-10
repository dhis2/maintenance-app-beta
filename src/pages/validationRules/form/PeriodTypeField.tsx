import i18n from '@dhis2/d2-i18n'
import { Field as FieldUI } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { PeriodTypeSelect } from '../../../components/metadataFormControls/PeriodTypeSelect/PeriodTypeSelect'
import css from './ValidationRuleFormFields.module.css'

export const PeriodTypeField = () => {
    const { input, meta } = useField('periodType')

    return (
        <div className={css.fieldContainer}>
            <FieldUI
                dataTest="formfields-periodtype"
                name="periodType"
                label={i18n.t('Period type')}
                error={meta.touched && !!meta.error}
                validationText={meta.touched ? meta.error : undefined}
            >
                <PeriodTypeSelect
                    selected={input.value}
                    invalid={meta.touched && !!meta.error}
                    onChange={(selected: string) => input.onChange(selected)}
                />
            </FieldUI>
        </div>
    )
}
