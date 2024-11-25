import { CalendarInput, CalendarInputProps } from '@dhis2/ui'
import React, { useState } from 'react'
import { useField } from 'react-final-form'
import { selectedLocale, useSystemSetting } from '../../../lib'

type DateFieldProps = Omit<
    CalendarInputProps,
    'name' | 'calendar' | 'onDateSelect' | 'date'
> & {
    name: string
    // this is not exposed in CalendarInputProps - but it should be
    label?: string
    required?: boolean
}
type ValidationProps = {
    error: boolean
    validationText?: string
    valid?: boolean
}
export function DateField({
    name,
    label,
    required,
    ...calendarInputProps
}: DateFieldProps) {
    const calendar = useSystemSetting('keyCalendar')
    const locale = selectedLocale
    const [validation, setValidation] = useState<ValidationProps>({
        error: false,
    })

    const { input } = useField<string | undefined>(name, {
        validate: () => {
            if (validation.error) {
                return validation.validationText
            }
        },
    })

    const handleChange: CalendarInputProps['onDateSelect'] = (
        payload: {
            calendarDateString: string
            validation?: ValidationProps
        } | null
    ) => {
        setValidation(payload?.validation || { error: false })
        input.onChange(payload?.calendarDateString || '')
        input.onBlur()
    }

    return (
        <div>
            <CalendarInput
                inputWidth={'400px'}
                date={input.value}
                name={name}
                calendar={calendar as CalendarInputProps['calendar']}
                onDateSelect={handleChange}
                timeZone={'utc'}
                locale={locale}
                onBlur={(_, e) => input.onBlur(e)}
                clearable
                label={required ? `${label} (required) *` : label}
                {...validation}
                valid={validation?.valid && input?.value !== ''}
                {...calendarInputProps}
            />
        </div>
    )
}
