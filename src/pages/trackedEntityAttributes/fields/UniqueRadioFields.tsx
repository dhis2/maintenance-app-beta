import i18n from '@dhis2/d2-i18n'
import { Radio } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'

export function UniqueRadioFields() {
    const name = 'orgunitScope'
    const { input } = useField<boolean>(name, {
        validateFields: [],
    })

    const handleChange = (value: boolean) => {
        input.onChange(value)
        input.onBlur()
    }

    return (
        <div>
            <Radio
                checked={input.value === false}
                value="false"
                label={i18n.t('Across entire system')}
                onChange={() => handleChange(false)}
            />

            <Radio
                checked={input.value === true}
                value="true"
                label={i18n.t('Per organisation unit')}
                onChange={() => handleChange(true)}
            />
        </div>
    )
}
