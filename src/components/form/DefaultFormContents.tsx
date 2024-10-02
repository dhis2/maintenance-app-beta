import i18n from '@dhis2/d2-i18n'
import { Card } from '@dhis2/ui'
import React from 'react'
import { useFormState } from 'react-final-form'
import { useNavigate } from 'react-router-dom'
import { getSectionPath } from '../../lib'
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
    const navigate = useNavigate()

    const listPath = `/${getSectionPath(section)}`

    return (
        <>
            <Card className={classes.form}>
                {children}

                <StandardFormSection>
                    <DefaultFormErrorNotice />
                </StandardFormSection>
            </Card>
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

    const navigate = useNavigate()

    const listPath = `/${getSectionPath(section)}`

    return (
        <Card className={classes.form}>
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
        </Card>
    )
}
