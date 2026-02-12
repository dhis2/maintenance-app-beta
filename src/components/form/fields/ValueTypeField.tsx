import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useField, useFormState } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    getConstantTranslation,
    useSchema,
    useSchemaSectionHandleOrThrow,
} from '../../../lib'
import { ConfirmationModalWrapper } from '../../confirmationModal'

const valueTypeHelpText = i18n.t(
    'Select the kind of data this attribute collects. If you have chosen an Option set, this will be set automatically.'
)
const valueTypeDisabledHelpText = i18n.t(
    'Disabled as the value type must match the value type of the selected option set.'
)

export function ValueTypeField({
    disabled: externallyDisabled = false,
    disabledText,
    required = false,
}: Readonly<{
    disabled?: boolean
    disabledText?: string
    required?: boolean
}>) {
    const { values } = useFormState({ subscription: { values: true } })
    const disabled = !!values.optionSet?.id || externallyDisabled
    const schemaSection = useSchemaSectionHandleOrThrow()
    const schema = useSchema(schemaSection.name)
    const isEdit = !!useParams().id

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
            ?.map((constant: string) => ({
                value: constant,
                label: getConstantTranslation(constant),
            }))
            .filter(({ value }: { value: string }) => {
                return optionSetHasMultiTextValueType || value !== 'MULTI_TEXT'
            }) || []

    const combinedHelpText = disabled
        ? disabledText ?? valueTypeDisabledHelpText
        : valueTypeHelpText

    const renderComponent = ({
        onChange,
    }: {
        onChange: (event: { selected: string }) => void
    }) => (
        <SingleSelectField
            dataTest="formfields-valueType"
            inputWidth="400px"
            selected={input.value}
            onChange={onChange}
            label={i18n.t('Value type (required)')}
            required={required}
            disabled={disabled}
            helpText={combinedHelpText}
        >
            {options.map((option: { value: string; label: string }) => (
                <SingleSelectOption
                    key={option.value}
                    label={option.label}
                    value={option.value}
                />
            ))}
        </SingleSelectField>
    )

    const handleChange = ({ selected }: { selected: string }) => {
        input.onChange(selected)
        input.onBlur()
    }

    if (isEdit && !externallyDisabled) {
        return (
            <ConfirmationModalWrapper
                onChange={handleChange}
                renderComponent={renderComponent}
                modalTitle={i18n.t('Change value type')}
                modalMessage={i18n.t(
                    'Changing the value type may cause issues when generating analytics tables if data already exists.'
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

    return <>{renderComponent({ onChange: handleChange })}</>
}
