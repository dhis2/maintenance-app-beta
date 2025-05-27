import React from 'react'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { FormBase } from '../../components/form/FormBase'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { ProgramIndicatorGroupsFormFields } from './form/ProgramIndicatorGroupsFormFields'
import { initialValues, validate } from './form/ProgramIndicatorGroupsSchema'

const section = SECTIONS_MAP.programIndicatorGroup

export const Component = () => {
    return (
        <FormBase
            initialValues={initialValues}
            onSubmit={useOnSubmitNew({ section })}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultNewFormContents section={section}>
                <ProgramIndicatorGroupsFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
