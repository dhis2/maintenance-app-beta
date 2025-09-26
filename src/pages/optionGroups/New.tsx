import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { OptionGroupFormFields } from './form/OptionGroupFormFields'
import { initialValues, validate } from './form/OptionGroupFormSchema'

const section = SECTIONS_MAP.optionGroup

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultNewFormContents section={section}>
                <OptionGroupFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
