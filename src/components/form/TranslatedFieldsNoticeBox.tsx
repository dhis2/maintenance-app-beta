import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import { useFormState } from 'react-final-form'
import { useCurrentUser, useSystemSettings } from '../../lib'

export function TranslatedFieldsNoticeBox() {
    const userSettings = useCurrentUser()
    const systemSettings = useSystemSettings()
    const { initialValues } = useFormState({
        subscription: { initialValues: true },
    })

    return (
        userSettings.settings.keyDbLocale !== systemSettings.keyDbLocale &&
        initialValues.id && (
            <NoticeBox
                title={
                    initialValues.displayName &&
                    initialValues.displayName !== initialValues.name
                        ? i18n.t('Name: {{displayName}} (Translated)', {
                              displayName: initialValues.displayName,
                          })
                        : undefined
                }
            >
                {i18n.t(
                    'Translatable fields appear in the default language in this form, not in your selected database language.'
                )}
            </NoticeBox>
        )
    )
}
