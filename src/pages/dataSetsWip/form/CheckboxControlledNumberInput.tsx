import i18n from '@dhis2/d2-i18n'
import { Checkbox, InputFieldFF } from '@dhis2/ui'
import type { InputFieldProps } from '@dhis2-ui/input'
import React, { useEffect, useState } from 'react'
import { FieldMetaState, useField } from 'react-final-form'
import classes from './HiddenInputField.module.css'

type InputFieldRestProps = Omit<InputFieldProps, 'onChange' | 'value' | 'name'>

export type HiddenInputFieldProps = InputFieldRestProps & {
    name: string
    label: string
    uncheckedValue: number
}

export function CheckboxControlledNumberInput({
    name,
    label,
    uncheckedValue,
    ...other
}: HiddenInputFieldProps) {
    const [isChecked, setIsChecked] = useState(false)
    const { input, meta } = useField(name, {
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

    const onCheckboxChange = () => {
        setIsChecked(!isChecked)
    }

    useEffect(() => {
        if (isChecked) {
            input.onChange(undefined)
            input.onBlur()
        } else {
            input.onChange(uncheckedValue.toString())
            input.onBlur()
        }
    }, [isChecked])

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
