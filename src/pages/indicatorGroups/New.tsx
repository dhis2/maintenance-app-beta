import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import IndicatorGroupFormFields from './form/IndicatorGroupFormFields'
import { initialValues, validate } from './form/indicatorGroupSchema'

const section = SECTIONS_MAP.indicatorGroup

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
        >
            <DefaultNewFormContents section={section}>
                <IndicatorGroupFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
