import { Button, SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import { Field, useField, useForm, useFormState } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import { useParams } from 'react-router-dom'
import {
    ModelSingleSelect,
    ModelSingleSelectField,
} from '../../../components/metadataFormControls/ModelSingleSelect'
import { generateDhis2Id } from '../../../lib'
import { DisplayableModel } from '../../../types/models'

export const ProgramDisaggregationFormFields = () => {
    const formState = useFormState()
    const array = useFieldArray('categoryMappings.cX5k9anHEHd')

    console.log({ formState, array })

    return (
        <div>
            <div>Program Disaggregation Form Fields</div>
            <DisaggregationCategories />
            <ProgramIndicatorMappings />
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

export const ProgramIndicatorMappings = () => {
    const programId = useParams().id
    const [programIndicators, setProgramIndicators] = React.useState<
        DisplayableModel[]
    >([])

    return (
        <div>
            <ModelSingleSelect<DisplayableModel>
                query={{
                    resource: 'programIndicators',
                    params: {
                        fields: ['id', 'name', 'displayName'],
                        filter: 'program.id:eq:' + programId,
                    },
                }}
                onChange={(selected) => {
                    if (selected) {
                        setProgramIndicators([...programIndicators, selected])
                    }
                }}
                selected={undefined}
            />
            <div>
                {programIndicators.map((indicator) => (
                    <div key={indicator.id}>
                        <span>{indicator.displayName}</span>
                        <Button
                            small
                            onClick={() => {
                                setProgramIndicators(
                                    programIndicators.filter(
                                        (i) => i.id !== indicator.id
                                    )
                                )
                            }}
                        >
                            Remove
                        </Button>
                        <ProgramIndicatorMapping programIndicator={indicator} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export const ProgramIndicatorMapping = ({
    programIndicator,
}: {
    programIndicator: DisplayableModel
}) => {
    const categoryCombo = useField(
        `programIndicatorMappings.${programIndicator.id}.categoryCombo`
    )

    console.log({ categoryCombo })
    return (
        <div>
            <ModelSingleSelectField
                label="Disaggregation category combination"
                query={{
                    resource: 'categoryCombos',
                    params: {
                        filter: 'dataDimensionType:eq:DISAGGREGATION',
                        fields: [
                            'id',
                            'displayName',
                            'categories[id,displayName]',
                        ],
                    },
                }}
                input={categoryCombo.input}
                meta={categoryCombo.meta}
            />

            {categoryCombo.input.value?.categories?.map((category) => (
                <div key={category.id}>
                    <span>{category.displayName}</span>
                    <CategoryMappingSelect
                        category={category}
                        programIndicatorId={programIndicator.id}
                    />
                </div>
            ))}
        </div>
    )
}

export const CategoryMappingSelect = ({
    category,
    programIndicatorId,
}: {
    category: DisplayableModel
    programIndicatorId: string
}) => {
    const availableMappings =
        useField(`categoryMappings.${category.id}`)?.input?.value || []
    const selectedMapping = useField(
        `programIndicatorMappings.${programIndicatorId}.disaggregation.${category.id}`,
        {
            initialValue:
                availableMappings.length === 1 ? availableMappings[0].id : null,
        }
    )
    console.log({ availableMappings, selectedMapping })

    return (
        <SingleSelectField
            label={`Mapping: ${category.displayName}`}
            onChange={(payload) =>
                selectedMapping.input.onChange(payload.selected)
            }
            disabled={availableMappings.length === 0}
            placeholder={
                availableMappings.length < 1
                    ? 'No mappings available'
                    : 'Select mapping'
            }
            selected={selectedMapping.input.value}
        >
            {availableMappings?.map((mapping) => (
                <SingleSelectOption
                    key={mapping.id}
                    label={mapping.mappingName}
                    value={mapping.id}
                />
            ))}
        </SingleSelectField>
    )
}
