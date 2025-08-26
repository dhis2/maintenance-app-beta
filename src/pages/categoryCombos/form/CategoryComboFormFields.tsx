import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, RadioFieldFF } from '@dhis2/ui'
import { capitalize } from 'lodash'
import React from 'react'
import { Field } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    StandardFormField,
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    HorizontalFieldGroup,
    NameField,
    CodeField,
} from '../../../components'
import { SchemaName, SECTIONS_MAP, useSchema } from '../../../lib'
import { getSchemaPropertyForPath } from '../../../lib/models/path'
import { CategoriesField } from './CategoriesField'

const section = SECTIONS_MAP.categoryCombo

export const CategoryComboFormFields = () => {
    const isNewForm = useParams().id === undefined
    const schema = useSchema(SchemaName.categoryCombo)
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this category combination.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <NameField schemaSection={section} />
                </StandardFormField>

                <StandardFormField>
                    <CodeField schemaSection={section} />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Data configuration')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose how this category combination will be used to capture and analyze data.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <HorizontalFieldGroup
                        label={'Data dimension type (required)'}
                    >
                        {getSchemaPropertyForPath(
                            schema,
                            'dataDimensionType'
                        )?.constants?.map((dataDimansionType) => (
                            <Field<string | undefined>
                                name="dataDimensionType"
                                key={dataDimansionType}
                                component={RadioFieldFF}
                                label={i18n.t(capitalize(dataDimansionType))}
                                type="radio"
                                value={dataDimansionType}
                                disabled={!isNewForm}
                            />
                        ))}
                    </HorizontalFieldGroup>
                </StandardFormField>
                <StandardFormField>
                    <Field
                        name="skipTotal"
                        type="checkbox"
                        component={CheckboxFieldFF}
                        label={i18n.t('Skip category total in reports')}
                    />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    <label htmlFor="categories">{i18n.t('Categories')}</label>
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose the categories to include in this category combination.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <CategoriesField />
                </StandardFormField>
            </StandardFormSection>
        </>
    )
}
