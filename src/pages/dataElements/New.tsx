import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import {
    DataElementFormFields,
    dataElementValueFormatter,
    initialValues,
    validate,
} from './form'

const section = SECTIONS_MAP.dataElement

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            valueFormatter={dataElementValueFormatter}
        >
            <DefaultNewFormContents section={section}>
                <DataElementFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
