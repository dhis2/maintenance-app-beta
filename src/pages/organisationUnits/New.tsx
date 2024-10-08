import React from 'react'
import { FormBase } from '../../components'
import { SECTIONS_MAP, useOnSubmitNew, validate } from '../../lib'
import {
    FormValues,
    initialValues,
    OrganisationUnitFormField,
    organisationUnitSchema,
} from './form'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'

const formatFormValues: (values: FormValues) => Record<string, unknown> = (
    values
) => {
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
        parent: values.parent,
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
const section = SECTIONS_MAP.organisationUnit

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({
                section,
                valueFormatter: formatFormValues,
            })}
            initialValues={initialValues as FormValues}
            validate={(values: FormValues) => {
                return validate(organisationUnitSchema, values)
            }}
        >
            <DefaultNewFormContents section={section}>
                <OrganisationUnitFormField />
            </DefaultNewFormContents>
        </FormBase>
    )
}
