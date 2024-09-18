import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { ColorAndIconPicker } from '../../../components'
import { IconPicker } from '../../../components/ColorAndIconPicker/IconPicker'

export function ImageField() {
    const { input: iconInput } = useField('style.image', {
        validateFields: [],
    })

    return (
        <Field label={i18n.t('Image')}>
            <IconPicker
                icon={iconInput.value}
                onIconPick={({ icon }: { icon: string }) => {
                    iconInput.onChange(icon)
                }}
            />
        </Field>
    )
}
