import { InputFieldFF, SingleSelectFieldFF, TextAreaFieldFF } from '@dhis2/ui'
import * as React from 'react'
import { Field as FieldRFF, useFormState } from 'react-final-form'
import { StandardFormSection } from '../../../components'
import { Attribute } from '../../../types/generated'
import { FormValues } from './types'

const inputWidth = '440px'

type CustomAttributeProps = {
    attribute: Attribute
    index: number
}

function CustomAttribute({ attribute, index }: CustomAttributeProps) {
    // console.log('> attribute', attribute)
    const name = `attributeValues[${index}].value`

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

type CustomAttributesProps = { customAttributes?: Attribute[] }
export function CustomAttributes({
    customAttributes = [],
}: CustomAttributesProps) {
    const { initialValues } = useFormState<FormValues>()

    return (
        <>
            {initialValues.attributeValues?.map((attributeValue, index) => {
                const attributeValueId = attributeValue.attribute.id
                const attribute = customAttributes.find(
                    ({ id }) => id === attributeValueId
                )

                if (!attribute) {
                    console.warn(
                        `Could not find attribute for attributeValue with id "${attributeValueId}"`
                    )

                    return null
                }

                return (
                    <CustomAttribute
                        key={attributeValue.attribute.id}
                        attribute={attribute}
                        index={index}
                    />
                )
            })}
        </>
    )
}
