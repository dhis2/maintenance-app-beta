import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { IndicatiorFormFields } from './form/IndicatorFormFields'
import { initialValues, validate } from './form/IndicatorSchema'

const section = SECTIONS_MAP.indicator

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
        >
            <DefaultNewFormContents section={section}>
                <IndicatiorFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
