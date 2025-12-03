import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import { useForm, useFormState } from 'react-final-form'
import { getSectionPath, useCurrentUser } from '../../lib'
import { SubmitAction } from '../../lib/form/useOnSubmit'
import { ModelSection } from '../../types'
import { StandardFormActions, StandardFormSection } from '../standardForm'
import classes from './DefaultFormContents.module.css'
import { DefaultFormErrorNotice } from './DefaultFormErrorNotice'
import { DefaultFormFooter } from './DefaultFormFooter'
import { useFormBase } from './formBase/FormBaseContext'

export function DefaultEditFormContents({
    children,
    section,
}: {
    children: React.ReactNode
    section: ModelSection
}) {
    const listPath = `/${getSectionPath(section)}`
    const { initialValues } = useFormState({
        subscription: { initialValues: true },
    })
    const userSettings = useCurrentUser()
    return (
        <>
            <div className={classes.form}>
                {userSettings.settings.keyDbLocale !==
                    userSettings.settings.keyUiLocale && (
                    <NoticeBox
                        title={
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
                )}
                {children}

                <StandardFormSection>
                    <DefaultFormErrorNotice />
                </StandardFormSection>
            </div>
            <DefaultFormFooter cancelTo={listPath} />
        </>
    )
}

export function DefaultNewFormContents({
    section,
    children,
}: {
    children: React.ReactNode
    section: ModelSection
}) {
    const { submitting } = useFormState({
        subscription: { submitting: true },
    })
    const { submit } = useForm()

    const { setSubmitAction } = useFormBase()

    const handleSubmit = (type: SubmitAction) => {
        setSubmitAction(type)
        submit()
    }

    const listPath = `/${getSectionPath(section)}`

    return (
        <div className={classes.form}>
            {children}
            <StandardFormSection>
                <DefaultFormErrorNotice />
            </StandardFormSection>
            <StandardFormActions
                cancelLabel={i18n.t('Exit without saving')}
                submitLabel={i18n.t('Create {{modelName}} ', {
                    modelName: section.title,
                })}
                onSaveClick={handleSubmit.bind(null, 'save')}
                onSubmitClick={handleSubmit.bind(null, 'saveAndExit')}
                submitting={submitting}
                cancelTo={listPath}
            />
        </div>
    )
}
