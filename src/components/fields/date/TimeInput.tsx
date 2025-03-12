import cx from 'classnames'
import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FieldWrapper } from '../../form'
import css from './TimeInput.module.css'

type FinalFormFieldProps = Pick<FieldRenderProps<string>, 'input' | 'meta'>

export type TimeFieldProps = {
    // this is not exposed in CalendarInputProps - but it should be
    label?: string
    required?: boolean
} & FinalFormFieldProps

export function TimeFieldFF({ meta, input, label, required }: TimeFieldProps) {
    return (
        <FieldWrapper meta={meta} {...input} label={label} required={required}>
            <TimeInput
                name={input.name}
                onChange={input.onChange}
                value={input.value}
            />
        </FieldWrapper>
    )
}

export const TimeInput = (
    inputProps: React.ComponentPropsWithoutRef<'input'>
) => {
    return (
        <input
            {...inputProps}
            className={cx(inputProps.className, css.timeInput)}
            type="time"
        />
    )
}
