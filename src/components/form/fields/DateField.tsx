import i18n from '@dhis2/d2-i18n'
import { CalendarInput, TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { SchemaSection, useCheckMaxLengthFromSchema } from '../../../lib'

export function DateField({
    name,
    label,
    calendar = 'gregory',
}: {
    name: string
    label?: string
    calendar?: string
}) {
    return (
        <FieldRFF name={name}>
            {(props) => (
                <CalendarInput
                    {...props}
                    input={props.input}
                    meta={props.meta}
                    editable
                    date={props.input.value}
                    calendar="gregory"
                    onDateSelect={(date) => {
                        props.input.onChange(
                            date ? date?.calendarDateString : ''
                        )
                    }}
                    timeZone={'UTC'}
                />
            )}
        </FieldRFF>
    )
}
