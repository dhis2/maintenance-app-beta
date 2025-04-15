import { Button } from '@dhis2/ui'
import React from 'react'
import { Field, useField, useForm, useFormState } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import { SectionedFormSections } from '../../../components'
import { ModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect'
import { generateDhis2Id } from '../../../lib'
import { ProgramIndicatorMappingSection } from './ProgramIndicatorMappingSection'

export const ProgramDisaggregationFormFields = ({
    initialProgramIndicators,
}) => {
    const formState = useFormState()
    const array = useFieldArray('categoryMappings.cX5k9anHEHd')

    console.log({ formState, array })

    return (
        <div>
            <SectionedFormSections>
                <ProgramIndicatorMappingSection
                    initialProgramIndicators={initialProgramIndicators}
                />
                <DisaggregationCategories />
            </SectionedFormSections>
        </div>
    )
}

export const DisaggregationCategories = () => {
    const categories = Object.keys(
        useFormState().initialValues.categoryMappings
    )
    return (
        <div>
            <ModelSingleSelect
                query={{
                    resource: 'categories',
                }}
                onChange={() => {}}
            />
            {categories.map((id) => (
                <DisaggregationCategory key={id} id={id} />
            ))}
        </div>
    )
}

export const DisaggregationCategory = ({ id }: { id: string }) => {
    const array = useFieldArray(`categoryMappings.${id}`)
    const formApi = useForm()
    return (
        <div>
            {array.fields.map((fieldName, index) => {
                return (
                    <div key={fieldName}>
                        <CategoryMapping fieldName={fieldName} />
                        <Button
                            small
                            onClick={() => {
                                array.fields.push({
                                    categoryId: id,
                                    id: generateDhis2Id(),
                                    mappingName: 'A new mapping',
                                    options:
                                        formApi.getFieldState(fieldName)?.value
                                            .options,
                                    deleted: false,
                                })
                            }}
                        >
                            Add Mapping
                        </Button>
                    </div>
                )
            })}
        </div>
    )
}

type CategoryMappingProps = {
    fieldName: string
}
export const CategoryMapping = ({ fieldName }: CategoryMappingProps) => {
    const formApi = useForm()
    const categoryMapping = useField(fieldName)
    if (categoryMapping.input.value.deleted) {
        return (
            <div>
                Soft deleted
                <button
                    type="button"
                    onClick={() => {
                        formApi.change(fieldName, {
                            ...categoryMapping.input.value,
                            deleted: false,
                        })
                    }}
                >
                    Undo
                </button>
            </div>
        )
    }
    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    formApi.change(fieldName, {
                        ...categoryMapping.input.value,
                        deleted: true,
                    })
                }}
            >
                Remove
            </button>
            {categoryMapping.input.value.mappingName}
            {Object.keys(categoryMapping.input.value.options).map((opt) => (
                <Field
                    name={`${fieldName}.options.${opt}.filter`}
                    key={`${fieldName}.options.${opt}.filter`}
                    component="input"
                />
            ))}
        </div>
    )
}
