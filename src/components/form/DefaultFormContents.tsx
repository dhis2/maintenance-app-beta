import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useForm, useFormState } from 'react-final-form'
import { getSectionPath, useNavigateWithSearchState } from '../../lib'
import { ModelSection } from '../../types'
import { StandardFormActions, StandardFormSection } from '../standardForm'
import classes from './DefaultFormContents.module.css'
import { DefaultFormErrorNotice } from './DefaultFormErrorNotice'
import { DefaultFormFooter } from './DefaultFormFooter'

export function DefaultEditFormContents({
    children,
    section,
}: {
    children: React.ReactNode
    section: ModelSection
}) {
    const listPath = `/${getSectionPath(section)}`

    return (
        <>
            <div className={classes.form}>
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
    const navigate = useNavigateWithSearchState()

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
                submitting={submitting}
                onCancelClick={() => navigate(listPath)}
                onSubmitClick={submit}
            />
        </div>
    )
}
