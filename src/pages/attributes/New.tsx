import React from 'react'
import { FormBase } from '../../components'
import { DefaultNewFormContents } from '../../components/form/DefaultFormContents'
import { SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { Attribute } from '../../types/generated'
import { AttributeFormFields, initialValues, validate } from './form'
import { SectionedFormWrapper } from './SectionedFormWrapper'

const section = SECTIONS_MAP.attribute

export const Component = () => {
    return (
        <SectionedFormWrapper
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues as Attribute}
            validate={validate}
        >
            {/* <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            includeAttributes={false}
        > */}
            {/* <DefaultNewFormContents section={section}> */}

            <AttributeFormFields />

            {/* </DefaultNewFormContents> */}
            {/* </FormBase> */}
        </SectionedFormWrapper>
    )
}
