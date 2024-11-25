import i18n from '@dhis2/d2-i18n'
import { InputFieldFF, SingleSelectFieldFF, TextAreaFieldFF } from '@dhis2/ui'
import * as React from 'react'
import { Field as FieldRFF, useFormState } from 'react-final-form'
import {
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../..'
import { SchemaSection } from '../../../types'
import { Attribute, AttributeValue } from '../../../types/generated'

const inputWidth = '440px'

type ValuesWithAttributes = {
    attributeValues: AttributeValue[]
}

type CustomAttributeProps = {
    attribute: Attribute
    index: number
}

function CustomAttribute({ attribute, index }: CustomAttributeProps) {
    const name = `attributeValues[${index}].value`
    const required = attribute.mandatory

    if (attribute.optionSet?.options) {
        const options = attribute.optionSet?.options.map(
            ({ code, displayName }) => ({
                value: code,
                label: displayName,
            })
        )

        if (!required) {
            options.unshift({ value: '', label: i18n.t('<No value>') })
        }

        return (
            <StandardFormField key={attribute.id}>
                <FieldRFF
                    component={SingleSelectFieldFF}
                    required={required}
                    inputWidth={inputWidth}
                    label={attribute.displayFormName}
                    name={name}
                    options={options}
                />
            </StandardFormField>
        )
    }

    if (attribute.valueType === 'TEXT') {
        return (
            <StandardFormField key={attribute.id}>
                <FieldRFF
                    component={InputFieldFF}
                    required={required}
                    inputWidth={inputWidth}
                    label={attribute.displayFormName}
                    name={name}
                />
            </StandardFormField>
        )
    }

    if (attribute.valueType === 'LONG_TEXT') {
        return (
            <StandardFormField key={attribute.id}>
                <FieldRFF
                    component={TextAreaFieldFF}
                    required={required}
                    inputWidth={inputWidth}
                    label={attribute.displayFormName}
                    name={name}
                />
            </StandardFormField>
        )
    }

    if (attribute.valueType === 'GEOJSON') {
        return (
            <StandardFormField key={attribute.id}>
                <FieldRFF
                    component={TextAreaFieldFF}
                    required={required}
                    inputWidth={inputWidth}
                    label={attribute.displayFormName}
                    name={name}
                />
            </StandardFormField>
        )
    }
    // @TODO: Verify that all value types have been covered!
    throw new Error(`Implement value type "${attribute.valueType}"!`)
}

export function CustomAttributesSection({
    schemaSection,
}: {
    schemaSection: SchemaSection
}) {
    const formState = useFormState<ValuesWithAttributes>({
        subscription: { initialValues: true },
    })

    const customAttributes = formState.initialValues.attributeValues?.map(
        (av) => av.attribute
    )
    if (!customAttributes || customAttributes?.length < 1) {
        return null
    }

    return (
        <StandardFormSection>
            <StandardFormSectionTitle>
                {i18n.t('Attributes')}
            </StandardFormSectionTitle>

            <StandardFormSectionDescription>
                {i18n.t(
                    'Set up information for the attributes assigned to {{modelName}}',
                    { modelName: schemaSection.titlePlural.toLowerCase() }
                )}
            </StandardFormSectionDescription>
            {customAttributes?.map((customAttribute, index) => {
                return (
                    <CustomAttribute
                        key={customAttribute.id}
                        attribute={customAttribute}
                        index={index}
                    />
                )
            })}
        </StandardFormSection>
    )
}
