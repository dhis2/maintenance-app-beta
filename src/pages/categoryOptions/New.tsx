import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { validate } from './form'
import { CategoryOptionFormFields } from './form/CategoryOptionFormFields'
import { initialValues, transformFormValues } from './form/categoryOptionSchema'

const section = SECTIONS_MAP.categoryOption

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            valueFormatter={transformFormValues}
        >
            <DefaultNewFormContents section={section}>
                <CategoryOptionFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
