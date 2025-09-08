import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import ConstantFormFields from './form/ConstantFormFields'
import { initialValues, validate } from './form/ConstantFormSchema'

const section = SECTIONS_MAP.constant

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultNewFormContents section={section}>
                <ConstantFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
