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

const section = SECTIONS_MAP.organisationUnit

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({
                section,
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
