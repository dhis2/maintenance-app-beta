import { CalendarInput, CalendarInputProps } from '@dhis2/ui'
import React from 'react'
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
export function DateField({
    name,
    label,
    required,
    ...calendarInputProps
}: DateFieldProps) {
    const calendar = useSystemSetting('keyCalendar')
    const locale = selectedLocale
    const { meta, input } = useField<string | undefined>(name, {
        format: (value) => {
            if (value) {
                return value.slice(0, 10)
            }
            return value
        },
    })

    const handleChange: CalendarInputProps['onDateSelect'] = (payload) => {
        input.onChange(payload?.calendarDateString)
        input.onBlur()
    }

    return (
        <div style={{ width: '400px' }}>
            {/* TODO: we can remove style above, once inputWidth for CalendarInput is fixed */}
            <CalendarInput
                date={input.value}
                name={name}
                calendar={calendar as CalendarInputProps['calendar']}
                onDateSelect={handleChange}
                timeZone={'utc'}
                locale={locale}
                error={!!(meta.touched && meta.invalid && meta.error)}
                validationText={meta.touched ? meta.error : undefined}
                onBlur={(_, e) => input.onBlur(e)}
                clearable
                label={required ? `${label} (required) *` : label}
                {...calendarInputProps}
            />
        </div>
    )
}
