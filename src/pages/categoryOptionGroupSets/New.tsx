import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import CategoryOptionGroupSetFormFields from './form/CategoryOptionGroupSetFormFields'
import { initialValues, validate } from './form/categoryOptionGroupSetSchema'

const section = SECTIONS_MAP.categoryOptionGroupSet

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
        >
            <DefaultNewFormContents section={section}>
                <CategoryOptionGroupSetFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
