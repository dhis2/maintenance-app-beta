import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import ValidationRuleGroupsFormFields from './form/ValidationRuleGroupsFormFields'
import { initialValues, validate } from './form/validationRuleGroupsSchema'

const section = SECTIONS_MAP.validationRuleGroup

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultNewFormContents section={section}>
                <ValidationRuleGroupsFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
