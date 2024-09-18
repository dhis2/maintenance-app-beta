import React, { useEffect, useMemo, useRef } from 'react'
import { Form } from 'react-final-form'
import { getSectionPath, SCHEMA_SECTIONS, validate } from '../../lib'
import classes from '../dataElementGroupSets/New.module.css'
import {
    StandardFormActions,
    StandardFormSection,
    useCustomAttributesQuery,
} from '../../components'
import { NoticeBox } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { useNavigate } from 'react-router-dom'
import { OrganisationUnitFormField } from './form/OrganisationUnitFormFields'
import { FormValues } from './form/'
import { Attribute } from '../../types/generated'
import { organisationUnitSchema } from './form/'

const listPath = `/${getSectionPath(SCHEMA_SECTIONS.organisationUnit)}`

function useInitialValues(customAttributes: Attribute[]) {
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
        openingDate: '',
        attributeValues,
    }
}
function formatFormValues({ values }: { values: FormValues }) {
    return {
        name: values.name,
        shortName: values.shortName,
        code: values.code,
        openingDate: values.openingDate,
        closedDate: values.closedDate,
        description: values.description,
        contactPerson: values.contactPerson,
        address: values.address,
        email: values.email,
        phoneNumber: values.phoneNumber,
        url: values.url,
        geometry: {
            type: 'Point',
            coordinates: [
                values.geometry?.longitude,
                values.geometry?.latitude,
            ],
        },
        attributeValues: values.attributeValues.filter(({ value }) => !!value),
    }
}

export const Component = () => {
    const navigate = useNavigate()
    const customAttributesQuery = useCustomAttributesQuery()
    const initialValues = useInitialValues(customAttributesQuery.data)

    async function onSubmit(values: FormValues) {
        const payload = formatFormValues({
            values,
        })
        console.log('SUBMITTING', JSON.stringify(payload))
    }

    return (
        <Form
            validateOnBlur
            onSubmit={onSubmit}
            validate={(values: FormValues) => {
                return validate(organisationUnitSchema, values)
            }}
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
                <OrganisationUnitFormField />

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
                        submitLabel={i18n.t('Create organisation unit')}
                        submitting={submitting}
                        onCancelClick={onCancelClick}
                    />
                </StandardFormSection>
            </div>
        </>
    )
}
