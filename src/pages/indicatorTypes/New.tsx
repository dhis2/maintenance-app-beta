import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { validate } from './form'
import { IndicatorTypesFormFields } from './form/IndicatorTypesFormFields'
import { initialValues } from './form/IndicatorTypesSchema'

const section = SECTIONS_MAP.indicatorType

export const Component = () => {
    return (
        <FormBase
            initialValues={initialValues}
            onSubmit={useOnSubmitNew({ section })}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultNewFormContents section={section}>
                <IndicatorTypesFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
