import i18n from '@dhis2/d2-i18n'
import { IconCross16, NoticeBox } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { useSectionedFormContext } from '../../lib'
import {
    ErrorList,
    ServerSubmitErrorNotice,
} from '../form/DefaultFormErrorNotice'
import { useFormStateErrors } from '../form/useFormStateErrors'
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
    const [closed, setClosed] = useState(false)

    useEffect(() => {
        // allow error box to show again if closed
        setClosed(false)
    }, [formStateErrors.modifiedSinceLastSubmit])

    if (!formStateErrors.shouldShowErrors || !!closed) {
        return null
    }

    if (formStateErrors.hasValidationErrors) {
        const errorsWithlabels = Object.fromEntries(
            Object.entries(formStateErrors.validationErrors || {}).map(
                ([key, value]) => [context.getFieldLabel(key), value]
            )
        )
        return (
            <NoticeBox className={css.errorNoticeBox} warning>
                {/* minor hack, because title-prop only allows string, and we want to include a button*/}
                <div className={css.errorNoticeBoxHeader}>
                    <h6>{i18n.t('Validation errors')}</h6>
                    <span onClick={() => setClosed((prev) => !prev)}>
                        <IconCross16 />
                    </span>
                </div>
                <div className={css.errorNoticeBoxContent}>
                    <ErrorList errors={errorsWithlabels} />
                </div>
            </NoticeBox>
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
