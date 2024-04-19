import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSectionPath } from '../../lib'
import { ModelSection } from '../../types'
import { StandardFormSection, StandardFormActions } from '../standardForm'
import classes from './DefaultFormContents.module.css'

export function DefaultFormContents({
    children,
    section,
    submitError,
    submitting,
}: {
    children: React.ReactNode
    section: ModelSection
    submitting: boolean
    submitError?: string
}) {
    const formErrorRef = useRef<HTMLDivElement | null>(null)
    const navigate = useNavigate()

    const listPath = getSectionPath(section)
    useEffect(() => {
        if (submitError) {
            formErrorRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [submitError])

    return (
        <>
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

            <div className={classes.form}>{children}</div>

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
