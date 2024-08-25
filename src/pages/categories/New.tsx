import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { CategoryFormValues } from './Edit'
import { validate } from './form'
import { CategoryFormFields } from './form/CategoryFormFields'
import { initialValues } from './form/categorySchema'

const section = SECTIONS_MAP.category

export const Component = () => {
    return (
        <FormBase
            section={section}
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
        >
            <DefaultNewFormContents section={section}>
                <CategoryFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
