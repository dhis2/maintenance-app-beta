import i18n from '@dhis2/d2-i18n'
import {
    Button,
    InputFieldFF,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import React, { useEffect, useMemo } from 'react'
import { Field, useField } from 'react-final-form'
import { useParams } from 'react-router-dom'
import {
    CollapsibleCard,
    CollapsibleCardHeader,
    CollapsibleCardTitle,
    SectionedFormSection,
    StandardFormSectionTitle,
    StandardFormField,
    StandardFormSectionDescription,
} from '../../../components'
import {
    ModelSingleSelect,
    ModelSingleSelectField,
} from '../../../components/metadataFormControls/ModelSingleSelect'
import { DisplayableModel } from '../../../types/models'
import { ProgramIndicatorWithMapping } from '../Edit'
import {
    categoryComboFieldFilter,
    CategoryComboFromSelect,
} from './CategoriesSelector'
import { CategoryMapping } from './programDisaggregationSchema'
import css from './ProgramIndicatorMapping.module.css'

export const ProgramIndicatorMappingSection = ({
    initialProgramIndicators,
    programName,
}: {
    initialProgramIndicators: ProgramIndicatorWithMapping[]
    programName?: string
}) => {
    const programId = useParams().id
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
            <div className={css.programName}>
                {i18n.t(`Program: ${programName}`, { nsSeparator: '~:~' })}
            </div>
            <StandardFormSectionTitle>
                {i18n.t('Program indicator selection')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Choose program indicators and assign category combinations and category mappings to be used for disaggregation'
                )}
            </StandardFormSectionDescription>
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
                        // piInput.onChange({
                        //     ...piInput.value,
                        //     [selected.id]: {
                        //         ...selected,
                        //     },
                        // })
                        setProgramIndicators([...programIndicators, selected])
                    }
                }}
                transform={transformProgramsIndicatorsForSelect}
                selected={undefined}
                noMatchWithoutFilterText="No program indicators found"
                placeholder={i18n.t('Add a program indicator')}
            />
            <div className={css.collapsibleList}>
                {programIndicators.map((indicator) => (
                    <ProgramIndicatorCard
                        programIndicator={indicator}
                        key={indicator.id}
                    />
                ))}
            </div>
        </SectionedFormSection>
    )
}

const ProgramIndicatorCard = ({
    programIndicator,
}: {
    programIndicator: DisplayableModel
}) => {
    const { input: programIndicatorMappingsDeleted } = useField<string[]>(
        'deletedProgramIndicatorMappings'
    )

    const isDeleted = programIndicatorMappingsDeleted.value.includes(
        programIndicator.id
    )

    if (isDeleted) {
        return (
            <div className={css.programIndicatorCardDeleted}>
                <div className={css.deletedProgramIndicatorText}>
                    {i18n.t(
                        'All mappings for {{- programIndicator}} will be removed on save',
                        { programIndicator: programIndicator.displayName }
                    )}
                </div>

                <Button
                    small
                    onClick={() => {
                        programIndicatorMappingsDeleted.onChange(
                            programIndicatorMappingsDeleted.value.filter(
                                (deletedId: string) =>
                                    deletedId !== programIndicator.id
                            )
                        )
                    }}
                >
                    {i18n.t('Restore mappings')}
                </Button>
            </div>
        )
    }

    return (
        <CollapsibleCard
            key={programIndicator.id}
            headerElement={
                <CollapsibleCardHeader>
                    <CollapsibleCardTitle
                        prefix={i18n.t('Program Indicator:', {
                            nsSeparator: '>',
                        })}
                        title={programIndicator.displayName}
                    />
                    <Button
                        small
                        secondary
                        destructive
                        onClick={() => {
                            programIndicatorMappingsDeleted.onChange([
                                ...(programIndicatorMappingsDeleted.value ??
                                    []),
                                programIndicator.id,
                            ])
                        }}
                    >
                        {i18n.t('Remove program indicator mapping')}
                    </Button>
                </CollapsibleCardHeader>
            }
        >
            <ProgramIndicatorMapping programIndicator={programIndicator} />
        </CollapsibleCard>
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
    const attributeCombo = useField(
        `programIndicatorMappings.${programIndicator.id}.attributeCombo`
    )
    return (
        <div className={css.mappingFields}>
            <div>
                <ModelSingleSelectField<CategoryComboFromSelect>
                    label="Disaggregation category combination"
                    query={{
                        resource: 'categoryCombos',
                        params: {
                            filter: 'dataDimensionType:eq:DISAGGREGATION',
                            fields: categoryComboFieldFilter.concat(),
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
                                    name={`programIndicatorMappings.${programIndicator.id}.disaggregation.${category.id}`}
                                    category={category}
                                    onAddMapping={() => {
                                        const el = document.getElementById(
                                            'disaggregationCategories'
                                        )
                                        if (el) {
                                            el.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start',
                                            })
                                        }
                                    }}
                                />
                            </div>
                        )
                    )}
                </div>
            </div>
            <div>
                <ModelSingleSelectField<CategoryComboFromSelect>
                    label={i18n.t('Attribute category combination')}
                    query={{
                        resource: 'categoryCombos',
                        params: {
                            filter: 'dataDimensionType:eq:ATTRIBUTE',
                            fields: categoryComboFieldFilter.concat(),
                        },
                    }}
                    showNoValueOption
                    input={attributeCombo.input}
                    meta={attributeCombo.meta}
                />
                <div className={css.mappingList}>
                    {attributeCombo.input.value?.categories?.map(
                        (category: DisplayableModel) => (
                            <div key={category.id}>
                                <CategoryMappingSelect
                                    name={`programIndicatorMappings.${programIndicator.id}.attribute.${category.id}`}
                                    category={category}
                                    onAddMapping={() => {
                                        const el = document.getElementById(
                                            'attributeCategories'
                                        )
                                        if (el) {
                                            el.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start',
                                            })
                                        }
                                    }}
                                />
                            </div>
                        )
                    )}
                </div>
            </div>
            <StandardFormField>
                <Field
                    name={`programIndicatorMappings.${programIndicator.id}.aggregateExportDataElement`}
                    key={`programIndicatorMappings.${programIndicator.id}.aggregateExportDataElement`}
                    label={i18n.t('Data element for aggregate data export')}
                    component={InputFieldFF}
                />
            </StandardFormField>
        </div>
    )
}

export const CategoryMappingSelect = ({
    name,
    category,
    onAddMapping,
}: {
    name: string
    category: DisplayableModel
    onAddMapping?: () => void
}) => {
    const availableWithDeletedMappings = useField<CategoryMapping[]>(
        `categoryMappings.${category.id}`
    )?.input?.value

    const deletedCategories =
        useField<string[]>('deletedCategories')?.input?.value

    const availableMappings = useMemo(
        () =>
            (deletedCategories || []).includes(category.id)
                ? []
                : (availableWithDeletedMappings || []).filter(
                      ({ deleted }: { deleted: boolean }) => !deleted
                  ),
        [category.id, deletedCategories, availableWithDeletedMappings]
    )

    const selectedMapping = useField(name, {
        initialValue:
            // changing to >= 1 overwrites saved values when there are multiple choices.
            availableMappings.length === 1
                ? availableMappings[0].id
                : undefined,
    })

    const selected = useMemo(
        () =>
            availableMappings &&
            availableMappings
                .map((m) => m.id)
                .includes(selectedMapping.input.value)
                ? selectedMapping.input.value
                : undefined,
        [availableMappings, selectedMapping]
    )

    const hasSomeInvalidMappings = useMemo(() => {
        return availableMappings.some((catMappings: CategoryMapping) => {
            return Object.values(catMappings.options).some(
                (optionMapping) => !!optionMapping.invalid
            )
        })
    }, [availableMappings])

    return (
        <div>
            <div className={css.mappingSelectWrapper}>
                <SingleSelectField
                    label={`Category mapping: ${category.displayName}`}
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
                <Button
                    className={css.mappingSelectAddMappingButton}
                    secondary
                    onClick={() => onAddMapping?.()}
                >
                    {i18n.t('Add mapping')}
                </Button>
            </div>
            <span className={css.warning}>
                {hasSomeInvalidMappings &&
                    i18n.t('There are some invalid expressions')}
            </span>
        </div>
    )
}
