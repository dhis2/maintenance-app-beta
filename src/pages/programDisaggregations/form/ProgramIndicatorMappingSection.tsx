import { Button, SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    ModelSingleSelect,
    ModelSingleSelectField,
} from '../../../components/metadataFormControls/ModelSingleSelect'
import { DisplayableModel } from '../../../types/models'

export const ProgramIndicatorMappingSection = () => {
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
