import i18n from '@dhis2/d2-i18n'
import { Checkbox, InputFieldFF } from '@dhis2/ui'
import type { InputFieldProps } from '@dhis2-ui/input'
import React, { useEffect, useState } from 'react'
import { FieldMetaState, useField } from 'react-final-form'
import classes from './ToggledNumberInput.module.css'

type InputFieldRestProps = Omit<InputFieldProps, 'onChange' | 'value' | 'name'>

export type HiddenInputFieldProps = InputFieldRestProps & {
    name: string
    label: string
    uncheckedValue: number
}

export function ToggledNumberInput({
    name,
    label,
    uncheckedValue,
    ...other
}: HiddenInputFieldProps) {
    const { input, meta } = useField(name, {
        parse: (value?: string) => {
            return value === undefined || value === ''
                ? undefined
                : parseFloat(value)
        },
        type: 'number',
        format: (value) => value?.toString(),
        validate: (value) => {
            return value !== undefined && value < 0
                ? i18n.t('Value should be bigger than 0')
                : value === undefined
                ? i18n.t('Required')
                : undefined
        },
    })
    const [isChecked, setIsChecked] = useState(
        input.value !== uncheckedValue.toString()
    )

    const onCheckboxChange = ({ checked }: { checked: boolean }) => {
        setIsChecked(checked)
        if (checked) {
            input.onChange(undefined)
        } else {
            input.onChange(uncheckedValue.toString())
        }
        input.onBlur()
    }

    useEffect(() => {
        setIsChecked(input.value !== uncheckedValue.toString())
    }, [input.value, uncheckedValue])

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
