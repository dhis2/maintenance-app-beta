import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field } from 'react-final-form'
import {
    StandardFormField,
    StandardFormSection,
    StandardFormSectionTitle,
} from '../../../components'
import { IconFileField } from './IconFileField'

export function IconNewFormFields() {
    return (
        <StandardFormSection>
            <StandardFormSectionTitle>
                {i18n.t('Basic information')}
            </StandardFormSectionTitle>
            <StandardFormField>
                <IconFileField />
            </StandardFormField>
            <StandardFormField>
                <Field
                    component={InputFieldFF}
                    name="key"
                    label={i18n.t('Key')}
                    helpText={i18n.t('A unique identifier for this icon')}
                    inputWidth="400px"
                    required
                    validateFields={[]}
                />
            </StandardFormField>
            <StandardFormField>
                <Field
                    component={InputFieldFF}
                    name="description"
                    label={i18n.t('Description')}
                    inputWidth="400px"
                    validateFields={[]}
                />
            </StandardFormField>
            <StandardFormField>
                <Field
                    component={InputFieldFF}
                    name="keywords"
                    label={i18n.t('Keywords')}
                    helpText={i18n.t('Comma-separated list of keywords')}
                    inputWidth="400px"
                    validateFields={[]}
                />
            </StandardFormField>
        </StandardFormSection>
    )
}

export function IconEditFormFields({ href }: Readonly<{ href?: string }>) {
    return (
        <StandardFormSection>
            <StandardFormSectionTitle>
                {i18n.t('Basic information')}
            </StandardFormSectionTitle>
            {href && (
                <StandardFormField>
                    <img
                        src={href}
                        alt={i18n.t('Icon preview')}
                        style={{ width: 48, height: 48, display: 'block' }}
                    />
                </StandardFormField>
            )}
            <StandardFormField>
                <Field
                    component={InputFieldFF}
                    name="key"
                    label={i18n.t('Key')}
                    inputWidth="400px"
                    disabled
                    validateFields={[]}
                />
            </StandardFormField>
            <StandardFormField>
                <Field
                    component={InputFieldFF}
                    name="description"
                    label={i18n.t('Description')}
                    inputWidth="400px"
                    validateFields={[]}
                />
            </StandardFormField>
            <StandardFormField>
                <Field
                    component={InputFieldFF}
                    name="keywords"
                    label={i18n.t('Keywords')}
                    helpText={i18n.t('Comma-separated list of keywords')}
                    inputWidth="400px"
                    validateFields={[]}
                />
            </StandardFormField>
        </StandardFormSection>
    )
}
