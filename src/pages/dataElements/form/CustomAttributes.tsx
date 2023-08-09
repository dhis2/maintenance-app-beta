import { InputFieldFF, TextAreaFieldFF } from '@dhis2/ui'
import * as React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { StandardFormSection } from '../../../components'

const inputWidth = '440px'

export function CustomAttributes({
    attributes = [],
}: {
    attributes?: Array<{
        id: string,
        displayFormName: string,
        // @TODO(CustomAttributes): Implement all possible value types!
        valueType: 'TEXT' | 'LONG_TEXT',
        code: string,
        mandatory: boolean,
    }>,
}) {
    return (
        <>
            {attributes.map((attribute) => {
                const {
                    mandatory: required,
                    valueType,
                    displayFormName,
                    id,
                } = attribute

                // @TODO(CustomAttributes): What to use as name?
                const name = `attribute.${id}`

                if (valueType === 'TEXT') {
                    return (
                        <StandardFormSection key={attribute.id}>
                            <FieldRFF
                                component={InputFieldFF}
                                required={required}
                                inputWidth={inputWidth}
                                label={displayFormName}
                                name={name}
                            />
                        </StandardFormSection>
                    )
                }

                if (valueType === 'LONG_TEXT') {
                    return (
                        <StandardFormSection key={attribute.id}>
                            <FieldRFF
                                component={TextAreaFieldFF}
                                required={required}
                                inputWidth={inputWidth}
                                label={displayFormName}
                                name={name}
                            />
                        </StandardFormSection>
                    )
                }

                throw new Error(
                    `@TODO(CustomAttributes): Implement value type "${valueType}"!`
                )
            })}
        </>
    )
}
