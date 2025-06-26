import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import * as React from 'react'
import { Field as FieldRFF, useFormState } from 'react-final-form'
import {
    SectionedFormSection,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../..'
import { SchemaSection } from '../../../types'
import { Attribute, AttributeValue } from '../../../types/generated'
import { FormFieldByValueType } from '../../fields'

const inputWidth = '440px'

export type ValuesWithAttributes = {
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
            <StandardFormField
                key={attribute.id}
                dataTest={`attribute-${attribute.id}`}
            >
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

    return (
        <StandardFormField
            key={attribute.id}
            dataTest={`attribute-${attribute.id}`}
        >
            <FormFieldByValueType
                valueType={attribute.valueType}
                name={name}
                label={attribute.displayFormName}
                required={required}
            />
        </StandardFormField>
    )
}

export function CustomAttributesSection({
    schemaSection,
    useSectionedLayout = false,
}: {
    schemaSection: SchemaSection
    useSectionedLayout?: boolean
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

    const Wrapper = useSectionedLayout
        ? SectionedFormSection
        : StandardFormSection

    return (
        <Wrapper name="attributes">
            <StandardFormSectionTitle>
                {i18n.t('Attributes')}
            </StandardFormSectionTitle>

            <StandardFormSectionDescription>
                {i18n.t(
                    'Set up information for the attributes assigned to {{modelName}}.',
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
        </Wrapper>
    )
}
