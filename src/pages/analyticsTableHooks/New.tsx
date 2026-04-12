import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { AnalyticsTableHookFormFields } from './form/AnalyticsTableHookFormFields'
import { initialValues, validate } from './form/analyticsTableHookSchema'

const section = SECTIONS_MAP.analyticsTableHook

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultNewFormContents section={section}>
                <AnalyticsTableHookFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
