import React from 'react'
import { SECTIONS_MAP, useOnSubmitNew, getSectionPath } from '../../lib'
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
            cancelTo={`/${getSectionPath(section)}`}
        >
            <AttributeFormFields />
        </SectionedFormWrapper>
    )
}
