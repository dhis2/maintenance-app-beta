import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { Field as FieldRFF, useForm, useFormState } from 'react-final-form'
import { AGGREGATION_TYPE, required, useSchemas } from '../../../lib'

/**
 *
 * Field rule: When value type has a certain value, disable aggregationType
 *             field
 * Field rule: When value type has a certain value, disable aggregationType
 *             value to ''
 *
 */
const aggregationTypeHelpText = i18n.t(
    'The default way to aggregate this data element in analytics.'
)
const aggregationTypeDisabledHelpText = i18n.t(
    'Disabled for the selected value type.'
)
export function AggregationTypeField() {
    const { change } = useForm()
    const { values } = useFormState({ subscription: { values: true } })
    const disabled = [
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
    ].includes(values.valueType)

    useEffect(() => {
        if (disabled) {
            change('aggregationType', '')
        }
    }, [change, disabled])

    const { dataElement } = useSchemas()
    const options = dataElement.properties.aggregationType.constants?.map(
        (constant) => ({
            value: constant,
            label: AGGREGATION_TYPE[constant as keyof typeof AGGREGATION_TYPE],
        })
    )

    const helpText = disabled
        ? `${aggregationTypeHelpText} ${aggregationTypeDisabledHelpText}`
        : aggregationTypeHelpText

    return (
        <FieldRFF
            disabled={disabled}
            component={SingleSelectFieldFF}
            dataTest="dataelementsformfields-aggregationtype"
            required
            inputWidth="400px"
            name="aggregationType"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Aggregation type'),
            })}
            helpText={helpText}
            options={options || []}
            validateFields={[]}
            validate={required}
        />
    )
}
