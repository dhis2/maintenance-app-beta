import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useField, useFormState } from 'react-final-form'
import { ConfirmationModalWrapper } from '../../../components'
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

    const renderComponent = ({
        onChange,
    }: {
        onChange: (event: any) => void
    }) => (
        <SingleSelectField
            dataTest="formfields-valueType"
            inputWidth="400px"
            selected={input.value}
            onChange={onChange}
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
    return (
        <ConfirmationModalWrapper
            onChange={({ selected }) => {
                input.onChange(selected)
                input.onBlur()
            }}
            renderComponent={renderComponent}
            modalTitle={i18n.t('Change value type')}
            modalMessage={i18n.t(
                'Changing the value type may cause problems when generating analytics tables if there is existing data for this data element.'
            )}
            modalMessageSelectionSpecificConfirmation={(selection) =>
                i18n.t(
                    'Are you sure you want to change the {{objectType}} to {{newObjectTypeValue}}?',
                    {
                        objectType: i18n.t('value type'),
                        newObjectTypeValue: selection?.selected
                            ? getConstantTranslation(selection.selected)
                            : i18n.t('undefined'),
                    }
                )
            }
        />
    )
}
