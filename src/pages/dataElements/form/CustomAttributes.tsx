import { InputFieldFF, SingleSelectFieldFF, TextAreaFieldFF } from '@dhis2/ui'
import * as React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { StandardFormSection } from '../../../components'
import { Attribute } from '../../../types/generated'

const inputWidth = '440px'

type CustomAttributeProps = { attribute: Attribute }
function CustomAttribute({ attribute }: CustomAttributeProps) {
    const name = `attributeValues.${attribute.id}`

    if (attribute.optionSet?.options) {
        const options = attribute.optionSet?.options.map(
            ({ code, displayName }) => ({
                value: code,
                label: displayName,
            })
        )

        return (
            <StandardFormSection key={attribute.id}>
                <FieldRFF
                    component={SingleSelectFieldFF}
                    required={attribute.mandatory}
                    inputWidth={inputWidth}
                    label={attribute.displayFormName}
                    name={name}
                    options={options}
                />
            </StandardFormSection>
        )
    }

    if (attribute.valueType === 'TEXT') {
        return (
            <StandardFormSection key={attribute.id}>
                <FieldRFF
                    component={InputFieldFF}
                    required={attribute.mandatory}
                    inputWidth={inputWidth}
                    label={attribute.displayFormName}
                    name={name}
                />
            </StandardFormSection>
        )
    }

    if (attribute.valueType === 'LONG_TEXT') {
        return (
            <StandardFormSection key={attribute.id}>
                <FieldRFF
                    component={TextAreaFieldFF}
                    required={attribute.mandatory}
                    inputWidth={inputWidth}
                    label={attribute.displayFormName}
                    name={name}
                />
            </StandardFormSection>
        )
    }

    throw new Error(
        `@TODO(CustomAttributes): Implement value type "${attribute.valueType}"!`
    )
}

type CustomAttributesProps = { attributes?: Attribute[] }
export function CustomAttributes({ attributes = [] }: CustomAttributesProps) {
    return (
        <>
            {attributes.map((attribute) => (
                <CustomAttribute key={attribute.id} attribute={attribute} />
            ))}
        </>
    )
}
