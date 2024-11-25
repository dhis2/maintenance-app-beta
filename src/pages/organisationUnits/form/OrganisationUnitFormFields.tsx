import i18n from '@dhis2/d2-i18n'
import { InputFieldFF, TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import {
    CustomAttributesSection,
    ModelTransferField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    DefaultIdentifiableFields,
    DescriptionField,
} from '../../../components'
import { DateField } from '../../../components/form/fields/DateField'
import { SCHEMA_SECTIONS, SECTIONS_MAP, useSystemSetting } from '../../../lib'
import { GeometryFields } from './GeometryFields'
import { ImageField } from './ImageField'
import { OrganisationUnitSelector } from './OrganisationUnitSelector'

const schemaSection = SCHEMA_SECTIONS.organisationUnit

export function OrganisationUnitFormField() {
    const allowReferenceAssignments = useSystemSetting(
        'keyAllowObjectAssignment'
    )

    const section = SECTIONS_MAP.organisationUnit

    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    <label htmlFor="parent">
                        {i18n.t('Placement in hierarchy')}
                    </label>
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
                        'Set up the basic information for this organisation unit'
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
                        component={TextAreaFieldFF}
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
                <StandardFormField>
                    <FieldRFF<string | undefined>
                        component={InputFieldFF}
                        inputWidth="400px"
                        label={i18n.t('Contact person')}
                        name="contactPerson"
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF<string | undefined>
                        component={InputFieldFF}
                        inputWidth="400px"
                        label={i18n.t('Address')}
                        name="address"
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF<string | undefined>
                        component={InputFieldFF}
                        inputWidth="400px"
                        label={i18n.t('Email')}
                        name="email"
                        type="email"
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF<string | undefined>
                        component={InputFieldFF}
                        inputWidth="400px"
                        label={i18n.t('Phone number')}
                        name="phoneNumber"
                        type="tel"
                    />
                </StandardFormField>
                <StandardFormField>
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
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Location')}
                </StandardFormSectionTitle>

                <StandardFormSectionDescription>
                    {i18n.t('Set up the organisation unit location.')}
                </StandardFormSectionDescription>
                <GeometryFields />
            </StandardFormSection>
            {allowReferenceAssignments && (
                <StandardFormSection>
                    <StandardFormSectionTitle>
                        {i18n.t('Reference assignment')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Assign the organisation unit to related objects.'
                        )}
                    </StandardFormSectionDescription>
                    <StandardFormField>
                        <ModelTransferField
                            name="dataSets"
                            query={{
                                resource: 'dataSets',
                            }}
                            leftHeader={i18n.t('Available data sets')}
                            rightHeader={i18n.t('Selected data sets')}
                            filterPlaceholder={i18n.t(
                                'Filter available data sets'
                            )}
                            filterPlaceholderPicked={i18n.t(
                                'Filter selected data sets'
                            )}
                        />
                    </StandardFormField>
                    <StandardFormField>
                        <ModelTransferField
                            name="programs"
                            query={{
                                resource: 'programs',
                            }}
                            leftHeader={i18n.t('Available programs')}
                            rightHeader={i18n.t('Selected programs')}
                            filterPlaceholder={i18n.t(
                                'Filter available programs'
                            )}
                            filterPlaceholderPicked={i18n.t(
                                'Filter selected programs'
                            )}
                        />
                    </StandardFormField>
                </StandardFormSection>
            )}

            <CustomAttributesSection schemaSection={section} />
        </>
    )
}
