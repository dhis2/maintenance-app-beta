import { CheckboxField } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { useField } from 'react-final-form'
import styles from './CheckboxConfirmationWrapper.module.css'

export const CheckboxConfirmationWrapper = ({
    label,
    fieldToReset,
    defaultValue,
    children,
}: {
    label?: string
    fieldToReset?: string
    defaultValue: any
    children: React.ReactNode
}) => {
    const [checked, setChecked] = useState(false)
    const { input, meta } = useField(fieldToReset ?? '')
    const initialValue = meta?.initial

    useEffect(() => {
        setChecked(Boolean(fieldToReset && initialValue !== defaultValue))
    }, [setChecked, initialValue, defaultValue, fieldToReset])

    return (
        <>
            <div className={styles.checkBoxWrapper}>
                <CheckboxField
                    checked={checked}
                    label={label}
                    name="checkboxConfirmation"
                    onChange={() => {
                        setChecked((prev) => {
                            // if the checkbox is unchecked, reset field to default value
                            if (prev) {
                                if (fieldToReset && input?.onChange) {
                                    input.onChange(defaultValue)
                                }
                            }
                            return !prev
                        })
                    }}
                />
            </div>
            {checked && <>{children}</>}
        </>
    )
}
