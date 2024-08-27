import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { validate } from './form'
import { CategoryComboFormFields } from './form/CategoryComboFormFields'
import { initialValues } from './form/categoryComboSchema'

const section = SECTIONS_MAP.categoryCombo

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultNewFormContents section={section}>
                <CategoryComboFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
