import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { InputFieldFF, SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'
import { StandardFormSection, StandardFormField } from '../../../components'
import { Attribute } from '../../../types/generated'

const ATTRIBUTE_QUERY = {
    attributes: {
        resource: 'attributes',
        params: {
            fields: 'id,displayFormName,name,valueType,mandatory,optionSet[options[code,displayName,id]]',
        },
    },
}

type AttributeQueryResponse = {
    attributes: Attribute[]
}

export const AttributeValueField = () => {
    const { data, loading } = useDataQuery<{
        attributes: AttributeQueryResponse
    }>(ATTRIBUTE_QUERY)

    const allAttributes = data?.attributes?.attributes ?? []

    const pepfarAttr = allAttributes.find(
        (attr: { displayFormName: string }) =>
            attr.displayFormName === 'PEPFAR ID'
    )
    const classAttr = allAttributes.find(
        (attr: { displayFormName: string }) =>
            attr.displayFormName === 'Classification'
    )

    const createHiddenAttributeField = (index: number, attr: Attribute) => (
        <>
            <Field
                name={`attributeValues[${index}].attribute`}
                initialValue={{
                    id: attr.id,
                    name: attr.name,
                    displayName: attr.displayFormName,
                }}
                component="input"
                type="hidden"
            />
        </>
    )

    return (
        <StandardFormSection>
            {pepfarAttr && (
                <StandardFormField>
                    <Field
                        name="attributeValues[0].value"
                        component={InputFieldFF}
                        label={pepfarAttr.displayFormName}
                        inputWidth="400px"
                        loading={loading}
                    />
                    {createHiddenAttributeField(0, pepfarAttr)}
                </StandardFormField>
            )}

            {classAttr && classAttr.optionSet?.options?.length > 0 && (
                <StandardFormField>
                    <Field
                        name="attributeValues[1].value"
                        component={SingleSelectFieldFF}
                        label={classAttr.displayFormName}
                        inputWidth="400px"
                        options={classAttr.optionSet.options.map(
                            (opt: { displayName: string; code: string }) => ({
                                label: opt.displayName,
                                value: opt.code,
                            })
                        )}
                        placeholder={i18n.t('Select option')}
                        loading={loading}
                    />
                    {createHiddenAttributeField(1, classAttr)}
                </StandardFormField>
            )}
        </StandardFormSection>
    )
}
