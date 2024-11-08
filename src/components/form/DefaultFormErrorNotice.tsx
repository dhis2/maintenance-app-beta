import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React, { useEffect, useRef } from 'react'
import css from './DefaultFormErrorNotice.module.css'
import { useFormStateErrors } from './useFormStateErrors'

export function DefaultFormErrorNotice() {
    const formStateErrors = useFormStateErrors()
    console.log(formStateErrors)
    if (!formStateErrors.shouldShowErrors) {
        return null
    }
    if (formStateErrors.hasValidationErrors) {
        return (
            <ValidationErrorNotice>
                <ErrorList
                    errors={errorsWithLabels(
                        formStateErrors.validationErrors || {}
                    )}
                />
            </ValidationErrorNotice>
        )
    }

    if (formStateErrors.hasSubmitErrors) {
        return (
            <ServerSubmitErrorNotice>
                {formStateErrors.submitError}
            </ServerSubmitErrorNotice>
        )
    }
    return null
}

export const ValidationErrorNotice = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [])
    if (closed) {
        return null
    }
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
                {children}
            </NoticeBox>
        </div>
    )
}

export const ErrorList = ({ errors }: { errors: Record<string, string> }) => {
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
                            {key}:
                        </span>
                        <span>{JSON.stringify(value)}</span>
                    </li>
                )
            })}
        </ul>
    )
}

export const ServerSubmitErrorNotice = ({
    children,
}: {
    children: React.ReactNode
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
                error
                title={i18n.t('Something went wrong when submitting the form')}
            >
                <p>{children}</p>
            </NoticeBox>
        </div>
    )
}

const errorsWithLabels = (errors: Record<string, string>) => {
    const labels = getFieldLabelsBestEffort()
    return Object.fromEntries(
        Object.entries(errors).map(([key, value]) => {
            return [labels.get(key) || key, value]
        })
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
