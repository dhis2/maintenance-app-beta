import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { PredictorGroupFormFields } from './form/PredictorGroupFormFields'
import { initialValues, validate } from './form/predictorGroupSchema'

const section = SECTIONS_MAP.predictorGroup

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            includeAttributes={false}
        >
            <DefaultNewFormContents section={section}>
                <PredictorGroupFormFields />
            </DefaultNewFormContents>
        </FormBase>
    )
}
