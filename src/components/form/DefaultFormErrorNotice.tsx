import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import { FormState } from 'final-form'
import React, { useEffect, useRef } from 'react'
import { useFormState } from 'react-final-form'
import css from './DefaultFormErrorNotice.module.css'

const formStateSubscriptions = {
    errors: true,
    submitError: true,
    submitFailed: true,
    hasValidationErrors: true,
    hasSubmitErrors: true,
    dirtySinceLastSubmit: true,
}

type FormStateErrors = Pick<
    FormState<unknown>,
    keyof typeof formStateSubscriptions
>

export function DefaultFormErrorNotice() {
    const partialFormState: FormStateErrors = useFormState({
        subscription: formStateSubscriptions,
    })
    // only show after trying to submit
    if (
        !partialFormState.submitFailed ||
        (partialFormState.submitFailed && partialFormState.dirtySinceLastSubmit)
    ) {
        return null
    }

    if (partialFormState.hasValidationErrors) {
        return <ValidationErrors formStateErrors={partialFormState} />
    }

    if (partialFormState.hasSubmitErrors) {
        return <ServerSubmitError formStateErrors={partialFormState} />
    }
    return null
}

const ValidationErrors = ({
    formStateErrors,
}: {
    formStateErrors: FormStateErrors
}) => {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [])
    return (
        <div ref={ref}>
            <NoticeBox
                className={css.noticeBox}
                warning
                title={i18n.t('Validation errors')}
            >
                <p>
                    {i18n.t(
                        'Some fields have validation errors. Please fix them before saving.'
                    )}
                </p>
                {formStateErrors.errors && (
                    <ErrorList errors={formStateErrors.errors} />
                )}
            </NoticeBox>
        </div>
    )
}

const ErrorList = ({ errors }: { errors: Record<string, string> }) => {
    const labels = getFieldLabelsBestEffort()

    return (
        <ul style={{ padding: '0 16px' }}>
            {Object.entries(errors).map(([key, value]) => {
                return (
                    <li key={key} style={{ display: 'flex', gap: '8px' }}>
                        <span
                            style={{
                                fontWeight: '600',
                            }}
                        >
                            {labels.get(key) || key}:
                        </span>
                        <span>{value}</span>
                    </li>
                )
            })}
        </ul>
    )
}

const ServerSubmitError = ({
    formStateErrors,
}: {
    formStateErrors: FormStateErrors
}) => {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [])
    return (
        <div ref={ref}>
            <NoticeBox
                error
                title={i18n.t('Something went wrong when submitting the form')}
            >
                <p>{formStateErrors.submitError}</p>
            </NoticeBox>
        </div>
    )
}

/**
 * We don't have a good way to get the translated labels, so for now
 * we get these from the DOM. This is a best-effort approach.
 * TODO: Find a better way to get the labels, eg. by wrapping Field components
 * in a generic component that can register fields with metadata such as labels.
 */
const getFieldLabelsBestEffort = () => {
    const labels = Array.from(document.getElementsByTagName('label'))
        .filter((elem) => elem.htmlFor)
        .map((elem) => {
            const fieldName = elem.htmlFor
            const label = elem.firstChild?.textContent
                ?.replace('(required)', '')
                .trim()
            return [fieldName, label] as const
        })
    return new Map(labels)
}
