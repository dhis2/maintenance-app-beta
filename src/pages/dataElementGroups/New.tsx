import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import { FORM_ERROR } from 'final-form'
import React, { useEffect, useRef } from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from 'react-router-dom'
import { StandardFormActions, StandardFormSection } from '../../components'
import { SCHEMA_SECTIONS, getSectionPath } from '../../lib'
import { DataElementGroupFormFields, validate } from './form'
import type { FormValues } from './form'
import classes from './New.module.css'

const listPath = `/${getSectionPath(SCHEMA_SECTIONS.dataElementGroup)}`

const initialValues = {
    name: '',
    shortName: '',
    code: '',
    description: '',
    dataElements: [],
}

const ADD_NEW_DATA_ELEMENT_GROUP_MUTATION = {
    resource: 'dataElementGroups',
    type: 'create',
    data: (de: object) => de,
} as const

export function Component() {
    const dataEngine = useDataEngine()
    const navigate = useNavigate()

    const onSubmit = async (payload: FormValues) => {
        try {
            // We want the promise so we know when submitting is done. The promise
            // returned by the mutation function of useDataMutation will never
            // resolve
            await dataEngine.mutate(ADD_NEW_DATA_ELEMENT_GROUP_MUTATION, {
                variables: payload,
            })
        } catch (e) {
            return { [FORM_ERROR]: (e as Error | string).toString() }
        }

        navigate(listPath)
    }

    return (
        <Form
            validateOnBlur
            onSubmit={onSubmit}
            validate={validate}
            initialValues={initialValues}
        >
            {({ handleSubmit, submitting, submitError }) => (
                <form onSubmit={handleSubmit}>
                    <FormContents
                        submitError={submitError}
                        submitting={submitting}
                        onCancelClick={() => navigate(listPath)}
                    />
                </form>
            )}
        </Form>
    )
}

function FormContents({
    submitError,
    onCancelClick,
    submitting,
}: {
    submitting: boolean
    onCancelClick: () => void
    submitError?: string
}) {
    const formErrorRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (submitError) {
            formErrorRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [submitError])

    return (
        <>
            <div className={classes.form}>
                <DataElementGroupFormFields />

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

                <StandardFormSection>
                    <StandardFormActions
                        cancelLabel={i18n.t('Exit without saving')}
                        submitLabel={i18n.t('Create data element group')}
                        submitting={submitting}
                        onCancelClick={onCancelClick}
                    />
                </StandardFormSection>
            </div>
        </>
    )
}
