import i18n from '@dhis2/d2-i18n'
import { Field, Input } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import classes from './ScriptField.module.css'

export function ScriptField() {
    const {
        input: { value, onChange, onBlur },
        meta: { error, touched },
    } = useField<string | undefined>('script')

    const handleChange = ({ value }: { value?: string }) => {
        onChange(value || '')
    }

    const handleBlur = () => {
        onBlur()
    }

    return (
        <Field
            name="script"
            dataTest="formfields-script"
            label={i18n.t('Script')}
            error={touched && !!error}
            validationText={(touched && error?.toString()) || ''}
            helpText={i18n.t(
                'Four-letter script code in title case (e.g., Latn, Cyrl, Arab)'
            )}
        >
            <div className={classes.inputContainer}>
                <Input
                    name="script"
                    value={value || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched && !!error}
                    placeholder={i18n.t('e.g., Latn')}
                    dataTest="locale-script-field"
                />
            </div>
        </Field>
    )
}
