import i18n from '@dhis2/d2-i18n'
import { InputFieldFF, SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'
import { StandardFormSection, StandardFormField } from '../../../components'

const ATTRIBUTES = [
    {
        id: 'Z4X3J7jMLYV',
        label: 'Classification',
        type: 'select',
        options: [
            { code: 'INPUT', displayName: 'Input' },
            { code: 'ACTIVITY', displayName: 'Activity' },
            { code: 'OUTPUT', displayName: 'Output' },
            { code: 'IMPACT', displayName: 'Impact' },
        ],
    },
    {
        id: 'dLHLR5O4YFI',
        label: 'PEPFAR ID',
        type: 'text',
    },
] as const

export const AttributeValueField = () => (
    <StandardFormSection>
        {ATTRIBUTES.map((attr, i) => (
            <StandardFormField key={attr.id}>
                {attr.type === 'select' ? (
                    <Field
                        name={`attributeValues[${i}].value`}
                        component={SingleSelectFieldFF}
                        label={attr.label}
                        inputWidth="400px"
                        options={attr.options.map((opt) => ({
                            label: opt.displayName,
                            value: opt.code,
                        }))}
                        placeholder={i18n.t('Select option')}
                    />
                ) : (
                    <Field
                        name={`attributeValues[${i}].value`}
                        component={InputFieldFF}
                        label={attr.label}
                        inputWidth="400px"
                    />
                )}

                <Field
                    name={`attributeValues[${i}].attribute`}
                    component="input"
                    type="hidden"
                    initialValue={{ id: attr.id }}
                />
            </StandardFormField>
        ))}
    </StandardFormSection>
)
