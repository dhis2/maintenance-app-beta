import cx from 'classnames'
import React from 'react'
import css from './ButtonGroup.module.css'

export type ButtonOption = {
    value: string
    label: string
}

export type ButtonGroupProps = {
    options: ButtonOption[]
    selected?: string
    onChange: (value: string) => void
    dataTest?: string
}

export function ButtonGroup({
    options,
    selected,
    onChange,
    dataTest,
}: ButtonGroupProps) {
    return (
        <div className={css.buttonGroup} data-test={dataTest}>
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
                        data-test={
                            dataTest
                                ? `${dataTest}-option-${option.value}`
                                : undefined
                        }
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}
