import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useFormState } from 'react-final-form'
import { getSectionPath, useNavigateWithSearchState } from '../../lib'
import { ModelSection } from '../../types'
import { StandardFormActions, StandardFormSection } from '../standardForm'
import classes from './DefaultFormContents.module.css'
import { DefaultFormErrorNotice } from './DefaultFormErrorNotice'

export function DefaultEditFormContents({
    children,
    section,
}: {
    children: React.ReactNode
    section: ModelSection
}) {
    const { submitting } = useFormState({
        subscription: { submitting: true },
    })
    const navigate = useNavigateWithSearchState()

    const listPath = `/${getSectionPath(section)}`

    return (
        <>
            <div className={classes.form}>
                {children}

                <StandardFormSection>
                    <DefaultFormErrorNotice />
                </StandardFormSection>
            </div>
            <div className={classes.formActions}>
                <StandardFormActions
                    cancelLabel={i18n.t('Cancel')}
                    submitLabel={i18n.t('Save and close')}
                    submitting={submitting}
                    onCancelClick={() => navigate(listPath)}
                />
            </div>
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
            />
        </div>
    )
}
