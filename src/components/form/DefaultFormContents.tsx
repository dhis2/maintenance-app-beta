import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React, { useEffect, useRef } from 'react'
import { useFormState } from 'react-final-form'
import { useNavigate } from 'react-router-dom'
import { getSectionPath } from '../../lib'
import { ModelSection } from '../../types'
import { StandardFormSection, StandardFormActions } from '../standardForm'
import classes from './DefaultFormContents.module.css'

export function DefaultEditFormContents({
    children,
    section,
}: {
    children: React.ReactNode
    section: ModelSection
}) {
    const { submitting, submitError } = useFormState({
        subscription: { submitting: true, submitError: true },
    })

    const formErrorRef = useRef<HTMLDivElement | null>(null)
    const navigate = useNavigate()

    const listPath = `/${getSectionPath(section)}`
    useEffect(() => {
        if (submitError) {
            formErrorRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [submitError])

    return (
        <>
            <div className={classes.form}>{children}</div>
            {submitError && (
                <StandardFormSection>
                    <div ref={formErrorRef}>
                        <NoticeBox
                            error
                            title={i18n.t(
                                'Something went wrong when submitting the form'
                            )}
                        >
                            {submitError}
                        </NoticeBox>
                    </div>
                </StandardFormSection>
            )}
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
    const { submitting, submitError } = useFormState({
        subscription: { submitting: true, submitError: true },
    })

    const formErrorRef = useRef<HTMLDivElement | null>(null)
    const navigate = useNavigate()

    const listPath = `/${getSectionPath(section)}`
    useEffect(() => {
        if (submitError) {
            formErrorRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [submitError])

    return (
        <div className={classes.form}>
            {children}
            {submitError && (
                <StandardFormSection>
                    <div ref={formErrorRef}>
                        <NoticeBox
                            error
                            title={i18n.t(
                                'Something went wrong when submitting the form'
                            )}
                        >
                            {submitError}
                        </NoticeBox>
                    </div>
                </StandardFormSection>
            )}
            <div className={classes.formActions}>
                <StandardFormActions
                    cancelLabel={i18n.t('Exit without saving')}
                    submitLabel={i18n.t('Create {{modelName}} ', {
                        modelName: section.title,
                    })}
                    submitting={submitting}
                    onCancelClick={() => navigate(listPath)}
                />
            </div>
        </div>
    )
}
