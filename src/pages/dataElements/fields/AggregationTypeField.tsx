import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { Field as FieldRFF, useField, useForm } from 'react-final-form'
import { AGGREGATION_TYPE, required } from '../../../lib'

export const DISABLING_VALUE_TYPES = [
    'TEXT',
    'LONG_TEXT',
    'MULTI_TEXT',
    'LETTER',
    'PHONE_NUMBER',
    'EMAIL',
    'TRACKER_ASSOCIATE',
    'USERNAME',
    'FILE_RESOURCE',
    'COORDINATE',
    'DATE',
    'DATETIME',
    'TIME',
    'ORGANISATION_UNIT',
    'REFERENCE',
    'AGE',
    'URL',
    'IMAGE',
    'GEOJSON',
] as const

const aggregationTypeHelpText = i18n.t(
    'The default way to aggregate in analytics.'
)
const aggregationTypeDisabledHelpText = i18n.t(
    'Disabled for the selected value type.'
)

export function AggregationTypeField() {
    const { change } = useForm()
    const fieldName = 'aggregationType'
    const valueTypeField = useField('valueType')
    const aggregationTypeField = useField(fieldName)
    const valueType = valueTypeField.input.value
    const disabled = DISABLING_VALUE_TYPES.includes(
        valueType as (typeof DISABLING_VALUE_TYPES)[number]
    )

    useEffect(() => {
        if (disabled && aggregationTypeField.input.value !== 'NONE') {
            change(fieldName, 'NONE')
        }
    }, [change, disabled, fieldName, aggregationTypeField.input.value])

    const options = Object.entries(AGGREGATION_TYPE).map(([value, label]) => ({
        value,
        label,
    }))

    const helpText = disabled
        ? `${aggregationTypeHelpText} ${aggregationTypeDisabledHelpText}`
        : aggregationTypeHelpText

    return (
        <FieldRFF
            disabled={disabled}
            component={SingleSelectFieldFF}
            dataTest="formfields-aggregationType"
            required={!disabled}
            inputWidth="400px"
            name={fieldName}
            label={
                disabled
                    ? i18n.t('Aggregation type')
                    : i18n.t('{{fieldLabel}} (required)', {
                          fieldLabel: i18n.t('Aggregation type'),
                      })
            }
            helpText={helpText}
            options={options}
            validateFields={[]}
            validate={required}
        />
    )
}
