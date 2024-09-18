import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    CustomAttributesSection,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import {
    DefaultIdentifiableFields,
    DescriptionField,
} from '../../../components/form'
import { SCHEMA_SECTIONS } from '../../../lib'
import { ImageField } from './ImageField'
import { Field as FieldRFF } from 'react-final-form'
import { InputFieldFF } from '@dhis2/ui'
import { DateField } from '../../../components/form/fields/DateField'

const schemaSection = SCHEMA_SECTIONS.organisationUnit

export function OrganisationUnitFormField() {
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this organisation unit.'
                    )}
                </StandardFormSectionDescription>
                <DefaultIdentifiableFields />
                <StandardFormField>
                    <DateField
                        name="openingDate"
                        required
                        label={i18n.t('Opening date')}
                    />
                </StandardFormField>
                <StandardFormField>
                    <DateField
                        name="closedDate"
                        label={i18n.t('Closed date')}
                    />
                </StandardFormField>
                <StandardFormField>
                    <ImageField />
                </StandardFormField>
                <StandardFormField>
                    <DescriptionField schemaSection={schemaSection} />
                </StandardFormField>
                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    label={i18n.t('{{fieldLabel}}', {
                        fieldLabel: i18n.t('Contact person'),
                    })}
                    name="contactPerson"
                />
                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    label={i18n.t('{{fieldLabel}}', {
                        fieldLabel: i18n.t('Address'),
                    })}
                    name="address"
                />
                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    label={i18n.t('{{fieldLabel}}', {
                        fieldLabel: i18n.t('Email'),
                    })}
                    name="email"
                    type="email"
                />
                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    label={i18n.t('{{fieldLabel}}', {
                        fieldLabel: i18n.t('Phone number'),
                    })}
                    name="phoneNumber"
                    type="tel"
                />

                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    label={i18n.t('{{fieldLabel}}', {
                        fieldLabel: i18n.t('URL'),
                    })}
                    name="url"
                    type="url"
                    helpText={i18n.t(
                        'A web link that provides extra information.'
                    )}
                />
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Location')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t('Set up the organisation unit location.')}
                </StandardFormSectionDescription>

                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    label={i18n.t('{{fieldLabel}}', {
                        fieldLabel: i18n.t('Latitude'),
                    })}
                    name="geometry.latitude"
                />

                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    label={i18n.t('{{fieldLabel}}', {
                        fieldLabel: i18n.t('Longitude'),
                    })}
                    name="geometry.longitude"
                />
            </StandardFormSection>

            <CustomAttributesSection />
        </>
    )
}
