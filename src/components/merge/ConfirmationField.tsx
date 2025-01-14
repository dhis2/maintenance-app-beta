import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field, useField } from 'react-final-form'
import { DisplayableModel } from '../../types/models'
import css from './MergeFields.module.css'

type DisplayableModelWithName = DisplayableModel & { name: string }

const createConfirmationCode = (targetName: string, count: number) => {
    return `merge-${count}-${targetName.trim()}`
        .substring(0, 25)
        .replaceAll(' ', '-')
        .toLowerCase()
}

export const ConfirmationField = () => {
    const target = useField<DisplayableModelWithName>('target', {
        subscription: { value: true },
    }).input.value

    const sources = useField<DisplayableModelWithName[]>('sources', {
        subscription: { value: true },
    }).input.value

    if (!target || sources?.length < 1) {
        return null
    }
    const confirmationCode = createConfirmationCode(
        target.name,
        sources?.length ?? 0
    )
    const fieldLabelWithCode = (
        <span>
            {i18n.t('To confirm the merge, type the confirmation code:')}
            <span className={css.confirmationCode}>{confirmationCode}</span>
        </span>
    )

    return (
        <div className={css.confirmationFieldWrapper}>
            <h2>{i18n.t('Merging cannot be undone')}</h2>
            <Field
                component={InputFieldFF}
                name="confirmation"
                label={fieldLabelWithCode}
                validate={(value) => {
                    const res =
                        value === confirmationCode
                            ? undefined
                            : i18n.t('Confirmation code does not match')
                    return res
                }}
            />
        </div>
    )
}
