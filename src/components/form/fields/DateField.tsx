import { CalendarInput, CalendarInputProps } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { selectedLocale, useSystemSettings } from '../../../lib'

type DateFieldProps = Omit<
    CalendarInputProps,
    'name' | 'calendar' | 'onDateSelect' | 'date'
> & {
    name: string
    // this is not exposed in CalendarInputProps - but it should be
    label?: string
}
export function DateField({
    name,
    label,
    ...calendarInputProps
}: DateFieldProps) {
    const settings = useSystemSettings()
    const { keyCalendar: calendar } = settings
    const locale = selectedLocale
    const { meta, input } = useField<string | undefined>(name, {
        format: (value) => {
            if (value) {
                return value.slice(0, 10)
            }
            return value
        },
    })

    const handleChange: CalendarInputProps['onDateSelect'] = ({
        calendarDateString,
    }) => {
        input.onChange(calendarDateString)
        input.onBlur()
    }

    return (
        <CalendarInput
            date={input.value}
            name={name}
            calendar={calendar as CalendarInputProps['calendar']}
            onDateSelect={handleChange}
            timeZone={'utc'}
            locale={locale}
            inputWidth="400px"
            error={meta.touched && meta.invalid && meta.error}
            validationText={meta.touched && meta.error}
            onBlur={(_, e) => input.onBlur(e)}
            {...calendarInputProps}
            // hack to workaround type-error
            // TODO: fix once missing type is added to UI
            {...{ clearable: true, label }}
        />
    )
}
