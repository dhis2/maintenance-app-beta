import React, { useState } from 'react'
import { Checkbox, InputFieldFF } from '@dhis2/ui'
import { FieldMetaState, FieldRenderProps, useField } from 'react-final-form'
import i18n from '@dhis2/d2-i18n'
import classes from './HiddenInputField.module.css'
import { InputFieldRestProps } from '@dhis2/ui-forms/types/InputFieldFF/InputFieldFF'
import type { InputFieldProps } from '@dhis2-ui/input'

export type HiddenInputFieldProps = InputFieldRestProps & {
    fieldName: string
    label: string
    uncheckedValue: number
}

export function HiddenInputField({
    fieldName,
    label,
    uncheckedValue,
    ...other
}: HiddenInputFieldProps) {
    const [isChecked, setIsChecked] = useState(false)
    const { input, meta } = useField(fieldName, {
        parse: (value?: string) =>
            value === undefined || value === '' ? undefined : parseFloat(value),
        type: 'number',
        format: (value) => value?.toString(),
        initialValue: uncheckedValue,
        validate: (value) =>
            isChecked && value !== undefined && value <= 0
                ? i18n.t('Value should be bigger than 0')
                : isChecked && value === undefined
                ? i18n.t('Required')
                : undefined,
    })

    const onCheckboxChange = async () => {
        await setIsChecked(!isChecked)
        if (isChecked) {
            input.onChange(uncheckedValue.toString())
            input.onBlur()
        } else {
            input.onChange(undefined)
            input.onBlur()
        }
    }
    return (
        <>
            <Checkbox
                label={label}
                onChange={onCheckboxChange}
                checked={isChecked}
            />
            {isChecked && (
                <InputFieldFF
                    input={input}
                    meta={meta as FieldMetaState<string | undefined>}
                    inputWidth="250px"
                    className={classes.hiddenInputField}
                    {...other}
                />
            )}
        </>
    )
}
