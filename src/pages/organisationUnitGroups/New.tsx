import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { validate } from './form'
import { OrganisationalUnitGroupFormFields } from './form/OrganisationalUnitGroupFormFields'
import { initialValues } from './form/organisationUnitGroupSchema'

const section = SECTIONS_MAP.organisationUnitGroup

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
        >
            <DefaultNewFormContents section={section}>
                <OrganisationalUnitGroupFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
