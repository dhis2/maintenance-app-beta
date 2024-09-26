import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React, { useMemo } from 'react'
import { Form } from 'react-final-form'
import { useNavigate } from 'react-router-dom'
import {
    StandardFormActions,
    StandardFormSection,
    useCustomAttributesQuery,
} from '../../components'
import { getSectionPath, SCHEMA_SECTIONS, validate } from '../../lib'
import { Attribute } from '../../types/generated'
import classes from '../dataElementGroupSets/New.module.css'
import {
    OrganisationUnitFormField,
    FormValues,
    organisationUnitSchema,
} from './form'

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
        comment: values.comment,
        image: values.image,
        description: values.description,
        contactPerson: values.contactPerson,
        address: values.address,
        email: values.email,
        phoneNumber: values.phoneNumber,
        url: values.url,
        geometry:
            values.geometry?.longitude && values.geometry?.latitude
                ? {
                      type: 'Point',
                      coordinates: [
                          values.geometry?.longitude,
                          values.geometry?.latitude,
                      ],
                  }
                : undefined,
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
        console.log('SUBMITTING', payload)
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
                    <div className={classes.form}>
                        <OrganisationUnitFormField />
                        {submitError && (
                            <StandardFormSection>
                                <div>
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
                                onCancelClick={() => navigate(listPath)}
                            />
                        </StandardFormSection>
                    </div>
                </form>
            )}
        </Form>
    )
}
