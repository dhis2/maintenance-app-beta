import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { initialValues, OrganisationUnitFormField, validate } from './form'

const section = SECTIONS_MAP.organisationUnit
export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({
                section,
            })}
            initialValues={initialValues}
            validate={validate}
        >
            <DefaultNewFormContents section={section}>
                <OrganisationUnitFormField />
            </DefaultNewFormContents>
        </FormBase>
    )
}
