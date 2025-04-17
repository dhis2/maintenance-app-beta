import i18n from '@dhis2/d2-i18n'
import { Button, SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import React, { useEffect, useMemo } from 'react'
import { useField, useFormState } from 'react-final-form'
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
import { CategoryMapping, DisplayableModel } from '../../../types/models'
import { ProgramIndicatorWithMapping } from '../Edit'
import { CategoryMappingsRecord } from './programDisaggregationSchema'
import css from './ProgramIndicatorMapping.module.css'

export const ProgramIndicatorMappingSection = ({
    initialProgramIndicators,
}: {
    initialProgramIndicators: ProgramIndicatorWithMapping[]
}) => {
    const programId = useParams().id
    const { input: piInput } = useField(`programIndicatorMappings`)

    const [programIndicators, setProgramIndicators] = React.useState<
        DisplayableModel[]
    >(initialProgramIndicators)

    useEffect(() => {
        setProgramIndicators(initialProgramIndicators)
    }, [initialProgramIndicators])

    const transformProgramsIndicatorsForSelect = (
        results: DisplayableModel[]
    ) =>
        results.map((result) =>
            programIndicators.map((p) => p.id).includes(result.id)
                ? { ...result, disabled: true }
                : result
        )
    return (
        <SectionedFormSection name="programIndicatorMappings">
            <ModelSingleSelect<DisplayableModel>
                query={{
                    resource: 'programIndicators',
                    params: {
                        fields: ['id', 'name', 'displayName'],
                        filter: ['program.id:eq:' + programId],
                    },
                }}
                onChange={(selected) => {
                    if (selected) {
                        setProgramIndicators([...programIndicators, selected])
                    }
                }}
                transform={transformProgramsIndicatorsForSelect}
                selected={undefined}
                noMatchWithoutFilterText="No program indicators found"
                placeholder={i18n.t('Add a program indicator')}
            />
            <div className={css.collapsibleList}>
                {programIndicators.map((indicator, index) => (
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
                                <Button
                                    small
                                    secondary
                                    destructive
                                    onClick={() => {
                                        const newPiMappings =
                                            Object.fromEntries(
                                                Object.entries(
                                                    piInput.value
                                                ).filter(
                                                    ([key]) =>
                                                        indicator.id !== key
                                                )
                                            )
                                        piInput.onChange(newPiMappings)
                                        setProgramIndicators(
                                            programIndicators.filter(
                                                (_, piIndex) =>
                                                    index !== piIndex
                                            )
                                        )
                                    }}
                                >
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
                showNoValueOption
                input={categoryCombo.input}
                meta={categoryCombo.meta}
            />
            <div className={css.mappingList}>
                {categoryCombo.input.value?.categories?.map(
                    (category: DisplayableModel) => (
                        <div key={category.id}>
                            <CategoryMappingSelect
                                category={category}
                                programIndicatorId={programIndicator.id}
                            />
                        </div>
                    )
                )}
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
        useField(`categoryMappings.${category.id}`)?.input?.value ||
        ([] as CategoryMapping[])

    const selectedMapping = useField(
        `programIndicatorMappings.${programIndicatorId}.disaggregation.${category.id}`,
        {
            initialValue:
                availableMappings.length >= 1
                    ? availableMappings[0].id
                    : undefined,
        }
    )
    const selected = useMemo(
        () =>
            availableMappings &&
            availableMappings
                .map((m: CategoryMappingsRecord) => m.id)
                .includes(selectedMapping.input.value)
                ? selectedMapping.input.value
                : undefined,
        [availableMappings, selectedMapping]
    )

    return (
        <div className={css.mappingSelectWrapper}>
            <SingleSelectField
                label={`Mapping: ${category.displayName}`}
                onChange={(payload) =>
                    selectedMapping.input.onChange(payload.selected)
                }
                disabled={availableMappings.length < 1}
                placeholder={
                    availableMappings.length < 1
                        ? 'No mappings available'
                        : 'Select mapping'
                }
                selected={selected}
            >
                {availableMappings?.map((mapping: CategoryMapping) => (
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
