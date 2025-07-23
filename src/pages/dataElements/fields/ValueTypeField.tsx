import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useField, useFormState } from 'react-final-form'
import { getConstantTranslation, SchemaName, useSchema } from '../../../lib'

const valueTypeHelpText = i18n.t('The type of data that will be recorded.')
const valueTypeDisabledHelpText = i18n.t(
    'Disabled as the value type must match the value type of the selected option set'
)
export function ValueTypeField() {
    const { values } = useFormState({ subscription: { values: true } })
    const disabled = !!values.optionSet?.id
    const schema = useSchema(SchemaName.dataElement)

    const { input } = useField('valueType')
    useEffect(() => {
        if (values.optionSet?.valueType) {
            input.onChange(values.optionSet.valueType)
            input.onBlur()
        }
    }, [values.optionSet, input])

    const optionSetHasMultiTextValueType =
        values.valueType === 'MULTI_TEXT' ||
        (values.optionSet?.id && values.optionSet?.valueType === 'MULTI_TEXT')

    const options =
        schema.properties.valueType.constants
            ?.map((constant) => ({
                value: constant,
                label: getConstantTranslation(constant),
            }))
            .filter(({ value }) => {
                return optionSetHasMultiTextValueType || value !== 'MULTI_TEXT'
            }) || []

    const helpText = disabled
        ? `${valueTypeHelpText} ${valueTypeDisabledHelpText}`
        : valueTypeHelpText

    return (
        <SingleSelectField
            dataTest="formfields-valueType"
            inputWidth="400px"
            selected={input.value}
            onChange={({ selected }) => {
                input.onChange(selected)
                input.onBlur()
            }}
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Value type'),
            })}
            disabled={disabled}
            helpText={helpText}
        >
            {options.map((option) => (
                <SingleSelectOption
                    key={option.value}
                    label={option.label}
                    value={option.value}
                />
            ))}
        </SingleSelectField>
    )
}
