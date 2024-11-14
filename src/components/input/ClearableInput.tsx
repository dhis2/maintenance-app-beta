import { IconCross16, Input, InputProps } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import css from './ClearableInput.module.css'

export type ClearableInputProps = InputProps & {
    showClearButton?: boolean
    className?: string
    inputClassName?: string
    clearButtonClassName?: string
    onClear?: (e: React.MouseEvent<HTMLSpanElement>) => void
}

export const ClearableInput = ({
    className,
    inputClassName,
    clearButtonClassName,
    onClear,
    showClearButton = true,
    ...inputProps
}: ClearableInputProps) => {
    return (
        <span className={cx(css.clearableInputWrapper, className)}>
            <Input {...inputProps} className={inputClassName} />
            <span
                className={cx(
                    css.clearableInputClearButton,
                    clearButtonClassName
                )}
                onClick={onClear}
            >
                {showClearButton && <IconCross16 />}
            </span>
        </span>
    )
}
