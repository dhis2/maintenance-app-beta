import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import { FORM_ERROR } from 'final-form'
import React, { useEffect, useMemo, useRef } from 'react'
import { Form, useForm } from 'react-final-form'
import { useNavigate } from 'react-router-dom'
import {
    Loader,
    StandardFormActions,
    StandardFormSection,
} from '../../components'
import { SCHEMA_SECTIONS, getSectionPath, validate } from '../../lib'
import {
    AttributeMetadata,
    useCustomAttributesQuery,
} from '../../lib/models/attributes/'
import {
    DataElementGroupSetFormFields,
    dataElementGroupSetSchema,
} from './form'
import type { FormValues } from './form'
import classes from './New.module.css'

const listPath = `/${getSectionPath(SCHEMA_SECTIONS.dataElementGroupSet)}`

function useInitialValues(customAttributes: AttributeMetadata[]) {
    const attributeValues = useMemo(
        () =>
            customAttributes.map((attribute) => ({
                attribute,
                value: '',
            })),
        [customAttributes]
    )

    return {
        name: '',
        shortName: '',
        code: '',
        description: '',
        compulsory: false,
        dataDimension: false,
        dataElementGroups: [],
        attributeValues,
    }
}

const ADD_NEW_DATA_ELEMENT_GROUP_MUTATION = {
    resource: 'dataElementGroupSets',
    type: 'create',
    data: (de: object) => de,
} as const

export function Component() {
    const dataEngine = useDataEngine()
    const navigate = useNavigate()
    const customAttributesQuery = useCustomAttributesQuery()
    const initialValues = useInitialValues(customAttributesQuery.data)

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
        <Loader
            queryResponse={customAttributesQuery}
            label={i18n.t('Custom attributes')}
        >
            <Form
                validateOnBlur
                onSubmit={onSubmit}
                validate={(values: FormValues) => {
                    return validate(dataElementGroupSetSchema, values)
                }}
                initialValues={initialValues}
            >
                {({ handleSubmit, submitting, submitError }) => (
                    <form onSubmit={handleSubmit}>
                        <FormContents
                            submitError={submitError}
                            submitting={submitting}
                        />
                    </form>
                )}
            </Form>
        </Loader>
    )
}

function FormContents({
    submitError,
    submitting,
}: {
    submitting: boolean
    submitError?: string
}) {
    const formErrorRef = useRef<HTMLDivElement | null>(null)
    const { submit } = useForm()
    useEffect(() => {
        if (submitError) {
            formErrorRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [submitError])

    return (
        <>
            <div className={classes.form}>
                <DataElementGroupSetFormFields />

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
                        onSubmitClick={submit}
                        cancelTo={listPath}
                    />
                </StandardFormSection>
            </div>
        </>
    )
}
