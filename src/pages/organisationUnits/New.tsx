import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew, validate } from '../../lib'
import {
    FormValues,
    initialValues,
    OrganisationUnitFormField,
    organisationUnitSchema,
} from './form'

const formatFormValues: (values: FormValues) => Record<string, unknown> = (
    values
) => {
    return {
        ...values,
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
