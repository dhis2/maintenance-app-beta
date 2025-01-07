import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { validate } from './form'
import { OrganisationalUnitGroupSetFormFields } from './form/OrganisationalUnitGroupSetFormFields'
import { initialValues } from './form/organisationUnitGroupSetSchema'

const section = SECTIONS_MAP.organisationUnitGroupSet

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
        >
            <DefaultNewFormContents section={section}>
                <OrganisationalUnitGroupSetFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
