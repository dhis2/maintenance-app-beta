import { Field } from 'react-final-form'

import { DEFAULT_FIELD_FILTERS, SECTIONS_MAP } from '../../lib'
import { PickWithFieldFilters } from '../../types/generated'
import { Category } from '../../types/models'
import {
    DefaultFormContents,
    DefaultIdentifiableFields,
    DescriptionField,
    NewFormBase,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../components'
import React from 'react'
import { useParams } from 'react-router-dom'
import { categorySchema } from './form'
import { createFormValidate } from '../../lib/form/validate'
import { CheckboxFieldFF, RadioFieldFF, Field as UIField } from '@dhis2/ui'
import { initialValues } from './form/categorySchema'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'description',
    'categoryCombos',
    'categoryOptions',
    'dataDimension',
    'dataDimensionType',
    'displayFormName',
    // 'attributeValues',
] as const

type CategoryFormValues = PickWithFieldFilters<Category, typeof fieldFilters>

export const Component = () => {
    const section = SECTIONS_MAP.category
    const modelId = useParams().id as string

    console.log({ initialValues })
    return (
        <NewFormBase<CategoryFormValues>
            modelId={modelId}
            initialValues={initialValues}
            validate={createFormValidate(categorySchema)}
        >
            <DefaultFormContents section={section}>
                <StandardFormSection>
                    <StandardFormSectionTitle>
                        Basic information
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        Set up the basic information for this category.
                    </StandardFormSectionDescription>
                    <DefaultIdentifiableFields />
                    <DescriptionField
                        schemaSection={section}
                        helpText="Explain the purpose of this category."
                    />
                </StandardFormSection>

                <StandardFormSection>
                    <StandardFormSectionTitle>
                        Data configuration
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        Choose how this category will be used to capture and
                        analyze data.
                    </StandardFormSectionDescription>
                    <StandardFormField>
                        <UIField
                            label="Data dimension type (required)"
                            helpText="hello"
                        >
                            <Field<string | undefined>
                                name="dataDimensionType"
                                component={RadioFieldFF}
                                label="Disaggregation"
                                type="radio"
                                value={'DISAGGREGATION'}
                            />
                            <Field<string | undefined>
                                name="dataDimensionType"
                                component={RadioFieldFF}
                                label="Attribute"
                                type="radio"
                                value={'ATTRIBUTE'}
                            />
                        </UIField>
                    </StandardFormField>
                    <StandardFormField>
                        <Field
                            name="dataDimension"
                            type="checkbox"
                            component={CheckboxFieldFF}
                            label="Use as data dimension"
                            helpText="Category will be available to the analytics as another dimension"
                        />
                    </StandardFormField>
                </StandardFormSection>
            </DefaultFormContents>
        </NewFormBase>
    )
}
