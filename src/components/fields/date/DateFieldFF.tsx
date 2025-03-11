import i18n from '@dhis2/d2-i18n'
import { CalendarInput, CalendarInputProps } from '@dhis2/ui'
import React, { useState } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { selectedLocale, useSystemSetting } from '../../../lib'

type FinalFormFieldProps = Pick<FieldRenderProps<string>, 'input' | 'meta'>

export type DateFieldProps = Omit<
    CalendarInputProps,
    'name' | 'calendar' | 'onDateSelect' | 'date'
> & {
    // this is not exposed in CalendarInputProps - but it should be
    label?: string
    required?: boolean
} & FinalFormFieldProps

type ValidationProps = {
    error: boolean
    validationText?: string
    valid: boolean
    validationCode?: string
}
export function DateFieldFF({
    label,
    required,
    input,
    meta,
    ...calendarInputProps
}: DateFieldProps) {
    const calendar = useSystemSetting('keyCalendar')
    const locale = selectedLocale
    const [validation, setValidation] = useState<ValidationProps>({
        error: false,
        valid: true,
    })
    // this is to be able for form-level validation to show the error
    const ffControlledError = {
        error: meta.error && meta.touched,
        validationText: meta.error,
        valid: meta.valid ?? false,
    } satisfies ValidationProps
    const value = input.value ? input.value.substring(0, 10) : ''

    const handleChange: CalendarInputProps['onDateSelect'] = (
        payload: {
            calendarDateString: string
            validation?: ValidationProps
        } | null
    ) => {
        if (!payload?.calendarDateString && required) {
            setValidation({
                error: true,
                valid: false,
                validationCode: 'EMPTY',
                validationText: i18n.t('Required'),
            })
        } else {
            setValidation(payload?.validation || { error: false, valid: true })
        }
        input.onChange(payload?.calendarDateString || '')
        input.onBlur()
    }
    const resolvedValidation =
        ffControlledError.error && !validation.error
            ? ffControlledError
            : validation

    return (
        <div>
            <CalendarInput
                inputWidth={'400px'}
                date={value}
                name={input.name}
                required={required}
                calendar={calendar as CalendarInputProps['calendar']}
                onDateSelect={handleChange}
                timeZone={'utc'}
                locale={locale}
                format={'YYYY-MM-DD'}
                onBlur={(_, e) => input.onBlur(e)}
                clearable
                label={required ? `${label} (required)` : label}
                {...resolvedValidation}
                valid={resolvedValidation?.valid && input?.value !== ''}
                {...calendarInputProps}
            />
        </div>
    )
}
