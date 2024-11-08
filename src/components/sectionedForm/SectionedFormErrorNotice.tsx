import { NoticeBox } from '@dhis2/ui'
import React from 'react'
import { useSectionedFormContext } from '../../lib'
import { useFormStateErrors } from '../form'
import {
    ErrorList,
    ServerSubmitErrorNotice,
} from '../form/DefaultFormErrorNotice'
import css from './SectionForm.module.css'

export function SectionedFormErrorNotice() {
    return (
        <div className={css.bottomErrorNoticeWrapper}>
            <SectionedFormErrors />
        </div>
    )
}
export function SectionedFormErrors() {
    const formStateErrors = useFormStateErrors()
    const context = useSectionedFormContext()

    if (!formStateErrors.shouldShowErrors) {
        return null
    }

    if (formStateErrors.hasValidationErrors) {
        const errorsWithlabels = Object.fromEntries(
            Object.entries(formStateErrors.validationErrors || {}).map(
                ([key, value]) => [context.getFieldLabel(key), value]
            )
        )
        return (
            <NoticeBox className={css.bottomNoticeBox} warning>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>Validation errors</div>
                </div>
                <div>
                    <ErrorList errors={errorsWithlabels} />
                </div>
            </NoticeBox>
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
