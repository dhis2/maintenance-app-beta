import React from 'react'
import css from './ButtonGroup.module.css'

export type ButtonOption<T extends string = string> = {
    value: T
    label: string
    disabled?: boolean
}

export type ButtonGroupProps<T extends string = string> = {
    options: ButtonOption<T>[]
    selected?: T
    onChange: (value: T) => void
    className?: string
    dataTest?: string
    onBlur?: () => void
}

export function ButtonGroup<T extends string = string>({
    options,
    selected,
    onChange,
    onBlur,
    className,
    dataTest,
}: ButtonGroupProps<T>) {
    return (
        <div
            className={`${css.buttonGroup} ${className || ''}`}
            data-test={dataTest}
            role="tablist"
        >
            {options.map((option) => {
                const isSelected = selected && option.value === selected
                const isDisabled = option.disabled

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        aria-disabled={isDisabled}
                        disabled={isDisabled}
                        className={`${css.buttonOption} ${
                            isSelected ? css.buttonOptionSelected : ''
                        } ${isDisabled ? css.buttonOptionDisabled : ''}`}
                        onBlur={onBlur}
                        onClick={() => onChange(option.value)}
                        data-test={`${dataTest || 'button-group'}-option-${
                            option.value
                        }`}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}
