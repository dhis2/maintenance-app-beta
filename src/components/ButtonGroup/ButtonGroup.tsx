import cx from 'classnames'
import React from 'react'
import css from './ButtonGroup.module.css'

export type ButtonOption = Readonly<{
    value: string
    label: string
}>

export type ButtonGroupProps = Readonly<{
    options: ButtonOption[]
    selected?: string
    onChange: (value: string) => void
    dataTest: string
    ariaLabel?: string
}>

export const ButtonGroup = ({
    options,
    selected,
    onChange,
    dataTest,
    ariaLabel,
}: ButtonGroupProps) => {
    return (
        <fieldset
            className={css.buttonGroup}
            aria-label={ariaLabel}
            data-test={dataTest}
        >
            {options.map((option) => {
                const isSelected = selected === option.value

                return (
                    <button
                        key={option.value}
                        type="button"
                        className={cx(css.buttonOption, {
                            [css.buttonOptionSelected]: isSelected,
                        })}
                        onClick={() => onChange(option.value)}
                        aria-pressed={isSelected}
                        data-test={`${dataTest}-option-${option.value}`}
                    >
                        {option.label}
                    </button>
                )
                })}
        </fieldset>
    )
}
