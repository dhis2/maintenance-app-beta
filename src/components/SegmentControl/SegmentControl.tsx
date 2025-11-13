import React from 'react'
import css from './SegmentControl.module.css'

export type SegmentOption<T extends string = string> = {
    value: T
    label: string
    disabled?: boolean
}

export type SegmentControlProps<T extends string = string> = {
    options: SegmentOption<T>[]
    selected?: T
    onChange: (value: T) => void
    className?: string
    dataTest?: string
}

export function SegmentControl<T extends string = string>({
    options,
    selected,
    onChange,
    className,
    dataTest,
}: SegmentControlProps<T>) {
    return (
        <div
            className={`${css.segmentControl} ${className || ''}`}
            data-test={dataTest}
            role="tablist"
        >
            {options.map((option, index) => {
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
                        className={`${css.segmentOption} ${
                            isSelected ? css.segmentOptionSelected : ''
                        } ${isDisabled ? css.segmentOptionDisabled : ''}`}
                        onClick={() => {
                            if (!isDisabled) {
                                onChange(option.value)
                            }
                        }}
                        data-test={`${dataTest || 'segment-control'}-option-${
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
