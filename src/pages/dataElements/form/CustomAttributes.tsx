import { InputFieldFF, TextAreaFieldFF } from '@dhis2/ui'
import * as React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { StandardFormSection } from '../../../components'

const inputWidth = '440px'

export function CustomAttributes({
    attributes = [],
}: {
    attributes?: Array<{
        id: string
        displayFormName: string
        // @TODO(CustomAttributes): Implement all possible value types!
        valueType: 'TEXT' | 'LONG_TEXT'
        code: string
        mandatory: boolean
    }>
}) {
    return (
        <>
            {attributes.map((attribute) => {
                const name = `attributeValues.${attribute.id}`

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
            })}
        </>
    )
}
