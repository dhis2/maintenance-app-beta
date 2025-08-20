import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import OptionGroupSetFormFields from './form/OptionGroupSetFormFields'
import { initialValues, validate } from './form/optionGroupSetSchema'

const section = SECTIONS_MAP.optionGroupSet

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultNewFormContents section={section}>
                <OptionGroupSetFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
