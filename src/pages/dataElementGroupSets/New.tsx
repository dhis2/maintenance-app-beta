import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { useOnSubmitNew, SECTIONS_MAP } from '../../lib'
import { DataElementGroupSetFormFields, validate, initialValues } from './form'

const section = SECTIONS_MAP.dataElementGroupSet

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
        >
            <DefaultNewFormContents section={section}>
                <DataElementGroupSetFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
