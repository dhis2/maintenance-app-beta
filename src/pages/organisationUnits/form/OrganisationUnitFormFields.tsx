import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
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
import { DateField } from '../../../components/form/fields/DateField'
import { SCHEMA_SECTIONS } from '../../../lib'
import { ImageField } from './ImageField'
import { OrganisationUnitSelector } from './OrganisationUnitSelector'

const schemaSection = SCHEMA_SECTIONS.organisationUnit

export function OrganisationUnitFormField() {
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Placement in hierarchy')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose where this new organisation unit should be placed in the existing hierarchy'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <OrganisationUnitSelector />
                </StandardFormField>
            </StandardFormSection>
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
                        label={i18n.t('Opening date')}
                        required
                    />
                </StandardFormField>
                <StandardFormField>
                    <DateField
                        name="closedDate"
                        label={i18n.t('Closed date')}
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF<string | undefined>
                        component={InputFieldFF}
                        inputWidth="400px"
                        label={i18n.t('Comment')}
                        name="comment"
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
                    label={i18n.t('Contact person')}
                    name="contactPerson"
                />
                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    label={i18n.t('Address')}
                    name="address"
                />
                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    label={i18n.t('Email')}
                    name="email"
                    type="email"
                />
                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    label={i18n.t('Phone number')}
                    name="phoneNumber"
                    type="tel"
                />

                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    label={i18n.t('URL')}
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
                    label={i18n.t('Latitude')}
                    name="geometry.latitude"
                    type="number"
                    min="-90"
                    max="90"
                />

                <FieldRFF<string | undefined>
                    component={InputFieldFF}
                    inputWidth="400px"
                    label={i18n.t('Longitude')}
                    name="geometry.longitude"
                    type="number"
                    min="-180"
                    max="180"
                />
            </StandardFormSection>

            <CustomAttributesSection />
        </>
    )
}
