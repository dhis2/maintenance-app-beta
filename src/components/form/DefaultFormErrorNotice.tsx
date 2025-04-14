import i18n from '@dhis2/d2-i18n'
import {
    Button,
    IconChevronDown16,
    IconChevronUp16,
    IconCopy16,
    NoticeBox,
} from '@dhis2/ui'
import React, { useRef } from 'react'
import { ApiErrorReport } from '../../lib'
import css from './DefaultFormErrorNotice.module.css'
import { useFormStateErrors } from './useFormStateErrors'

export function DefaultFormErrorNotice() {
    const formStateErrors = useFormStateErrors()

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
            <ServerSubmitErrorNotice
                errorReport={formStateErrors.submitError}
            />
        )
    }
    return null
}

export const ValidationErrorNotice = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <div>
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
        <ul className={css.errorList}>
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

export const ServerSubmitErrorNoticeBox = ({
    children,
    title = i18n.t('Something went wrong when submitting the form'),
}: {
    children: React.ReactNode
    title?: string
}) => {
    return (
        <NoticeBox className={css.noticeBox} error title={title}>
            {children}
        </NoticeBox>
    )
}

export const ServerSubmitErrorNotice = ({
    errorReport,
}: {
    errorReport?: ApiErrorReport
}) => {
    const [showDetails, setShowDetails] = React.useState(false)
    // used to scroll to the error details when the button is clicked
    const errorDivRef = useRef<HTMLDivElement | null>(null)
    // used to select the error details text when copy button is clicked
    const errorPreRef = useRef<HTMLPreElement | null>(null)

    if (!errorReport) {
        return null
    }

    const verbatimError = JSON.stringify(errorReport.original, undefined, 2)

    const handleToggleDetails = () => {
        const newShow = !showDetails
        setShowDetails(newShow)
        if (newShow) {
            // timeout because the div may not be expanded yet
            setTimeout(
                () =>
                    errorDivRef.current?.scrollIntoView({
                        block: 'start',
                    }),
                0
            )
        }
    }

    const handleCopyClick = () => {
        const div = errorPreRef.current
        if (!div) {
            return
        }
        const range = document.createRange()
        range.selectNode(div)
        window.getSelection()?.removeAllRanges()
        window.getSelection()?.addRange(range)
        navigator.clipboard.writeText(verbatimError)
    }

    return (
        <ServerSubmitErrorNoticeBox>
            <div ref={errorDivRef}>
                <div>
                    <p className={css.errorMessage}>{errorReport.message}</p>

                    <ul className={css.errorList}>
                        {errorReport.errors.map((e, i) => (
                            <li key={i}>{e.message}</li>
                        ))}
                    </ul>
                </div>
                <Button
                    className={css.errorDetailsButton}
                    secondary
                    small
                    icon={
                        showDetails ? (
                            <IconChevronUp16 />
                        ) : (
                            <IconChevronDown16 />
                        )
                    }
                    onClick={handleToggleDetails}
                >
                    {showDetails
                        ? i18n.t('Hide error details')
                        : i18n.t('Show error details')}
                </Button>
            </div>
            {showDetails && (
                <pre className={css.errorDetails} ref={errorPreRef}>
                    <Button
                        className={css.copyButton}
                        onClick={handleCopyClick}
                        icon={<IconCopy16 />}
                    />
                    {verbatimError}
                </pre>
            )}
        </ServerSubmitErrorNoticeBox>
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
