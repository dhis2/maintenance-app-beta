import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import CategoryOptionGroupFormFields from './form/CategoryOptionGroupFormFields'
import { initialValues, validate } from './form/categoryOptionGroupSchema'

const section = SECTIONS_MAP.categoryOptionGroup

export const Component = () => {
    return (
        <FormBase
            section={section}
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
        >
            <DefaultNewFormContents section={section}>
                <CategoryOptionGroupFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
