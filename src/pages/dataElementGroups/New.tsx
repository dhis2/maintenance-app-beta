import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { DataElementGroupFormFields, initialValues, validate } from './form'

const section = SECTIONS_MAP.dataElementGroup

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
        >
            <DefaultNewFormContents section={section}>
                <DataElementGroupFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
