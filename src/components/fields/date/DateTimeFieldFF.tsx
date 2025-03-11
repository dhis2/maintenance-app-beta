import cx from 'classnames'
import React, { useMemo, useState } from 'react'
import { DateFieldFF, DateFieldProps } from './DateFieldFF'
import css from './DateTimeField.module.css'

const defaultTime = '12:00'

export const DateTimeFieldFF = (props: DateFieldProps) => {
    const [time, setTime] = useState('12:00')

    const originalInput = props.input
    const input = useMemo(() => {
        const handleChange = (calendarDateString: string) => {
            if (!calendarDateString) {
                originalInput.onChange('')
                setTime('')
                return
            }
            // if we select a date, set the time to the default
            let newTime = time
            if (!time) {
                newTime = defaultTime
                setTime(newTime)
            }
            const dateTime = `${calendarDateString}T${newTime}`
            originalInput.onChange(dateTime)
        }
        return {
            ...originalInput,
            onChange: handleChange,
        }
    }, [time, originalInput])

    return (
        <div className={css.wrapper}>
            <DateFieldFF {...props} input={input} />
            <input
                className={cx(css.timeInput, {
                    [css.withLabel]: !!props.label,
                })}
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
            />
        </div>
    )
}
