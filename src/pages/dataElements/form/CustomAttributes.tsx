import i18n from '@dhis2/d2-i18n'
import {
    InputFieldFF,
    NoticeBox,
    SingleSelectFieldFF,
    TextAreaFieldFF,
} from '@dhis2/ui'
import * as React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { StandardFormSection } from '../../../components'
import { Attribute } from '../../../types/generated'
import { useCustomAttributesQuery } from './useCustomAttributesQuery'

const inputWidth = '440px'

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
            <StandardFormSection key={attribute.id}>
                <FieldRFF
                    component={SingleSelectFieldFF}
                    required={required}
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
                    required={required}
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
                    required={required}
                    inputWidth={inputWidth}
                    label={attribute.displayFormName}
                    name={name}
                />
            </StandardFormSection>
        )
    }

    // @TODO: Verify that all value types have been covered!
    throw new Error(`Implement value type "${attribute.valueType}"!`)
}

export function CustomAttributes() {
    const customAttributes = useCustomAttributesQuery()
    const loading = customAttributes.loading
    const error = customAttributes.error

    if (loading) {
        return <>{i18n.t('Loading custom attributes')}</>
    }

    if (error) {
        return (
            <NoticeBox
                error
                title={i18n.t(
                    'Something went wrong with retrieving the custom attributes'
                )}
            >
                {error.toString()}
            </NoticeBox>
        )
    }

    return (
        <>
            {customAttributes.data?.map((customAttribute, index) => {
                return (
                    <CustomAttribute
                        key={customAttribute.id}
                        attribute={customAttribute}
                        index={index}
                    />
                )
            })}
        </>
    )
}
