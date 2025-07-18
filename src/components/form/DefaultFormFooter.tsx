import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useForm, useFormState } from 'react-final-form'
import { To } from 'react-router-dom'
import { createPortalToFooter } from '../../app/layout'
import { SubmitAction } from '../../lib/form/useOnSubmit'
import { StandardFormActions } from '../standardForm'
import css from './DefaultFormContents.module.css'
import { useFormBase } from './formBase/FormBaseContext'

export const DefaultFormFooter = ({ cancelTo }: { cancelTo?: To }) => {
    const { submit } = useForm()
    const { submitting } = useFormState({
        subscription: { submitting: true },
    })
    const { setSubmitAction } = useFormBase()

    const handleSubmit = (type: SubmitAction) => {
        setSubmitAction(type)
        submit()
    }

    return createPortalToFooter(
        <div className={css.formActions}>
            <StandardFormActions
                cancelLabel={i18n.t('Cancel')}
                submitLabel={i18n.t('Save and close')}
                submitting={submitting}
                onSubmitClick={handleSubmit.bind(null, 'saveAndExit')}
                onSaveClick={handleSubmit.bind(null, 'save')}
                cancelTo={cancelTo ?? '../'}
            />
        </div>
    )
}
