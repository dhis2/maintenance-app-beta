import i18n from '@dhis2/d2-i18n'
import { Button, SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    CollapsibleCard,
    CollapsibleCardHeader,
    CollapsibleCardTitle,
    SectionedFormSection,
} from '../../../components'
import {
    ModelSingleSelect,
    ModelSingleSelectField,
} from '../../../components/metadataFormControls/ModelSingleSelect'
import { DisplayableModel } from '../../../types/models'
import css from './ProgramIndicatorMapping.module.css'

export const ProgramIndicatorMappingSection = () => {
    const programId = useParams().id
    const [programIndicators, setProgramIndicators] = React.useState<
        DisplayableModel[]
    >([])
    const selectedFilter =
        programIndicators.length > 0
            ? [`id:!in:[${programIndicators.map((p) => p.id)}]`]
            : []
    return (
        <SectionedFormSection name="programIndicatorMappings">
            <ModelSingleSelect<DisplayableModel>
                query={{
                    resource: 'programIndicators',
                    params: {
                        fields: ['id', 'name', 'displayName'],
                        filter: [
                            'program.id:eq:' + programId,
                            ...selectedFilter,
                        ],
                    },
                }}
                onChange={(selected) => {
                    if (selected) {
                        setProgramIndicators([...programIndicators, selected])
                    }
                }}
                selected={undefined}
                noMatchWithoutFilterText="No program indicators found"
                placeholder={i18n.t('Add a program indicator')}
            />
            <div className={css.collapsibleList}>
                {programIndicators.map((indicator) => (
                    <CollapsibleCard
                        key={indicator.id}
                        headerElement={
                            <CollapsibleCardHeader>
                                <CollapsibleCardTitle
                                    prefix={i18n.t('Program Indicator:', {
                                        nsSeparator: '>',
                                    })}
                                    title={indicator.displayName}
                                />
                                <Button small secondary destructive>
                                    {i18n.t('Remove program indicator mapping')}
                                </Button>
                            </CollapsibleCardHeader>
                        }
                    >
                        <ProgramIndicatorMapping programIndicator={indicator} />
                    </CollapsibleCard>
                ))}
            </div>
        </SectionedFormSection>
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
    return (
        <div className={css.mappingFields}>
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
            <div className={css.mappingList}>
                {categoryCombo.input.value?.categories?.map((category) => (
                    <div key={category.id}>
                        <CategoryMappingSelect
                            category={category}
                            programIndicatorId={programIndicator.id}
                        />
                    </div>
                ))}
            </div>
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
        <div className={css.mappingSelectWrapper}>
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
            <Button className={css.mappingSelectAddMappingButton} secondary>
                {i18n.t('Add mapping')}
            </Button>
        </div>
    )
}
