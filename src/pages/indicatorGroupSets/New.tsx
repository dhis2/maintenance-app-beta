import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import IndicatorGroupSetFormFields from './form/IndicatorGroupSetFormFields'
import { initialValues, validate } from './form/indicatorGroupSetSchema'

const section = SECTIONS_MAP.indicatorGroupSet

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultNewFormContents section={section}>
                <IndicatorGroupSetFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
