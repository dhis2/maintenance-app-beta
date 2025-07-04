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
import { DEFAULT_CATEGORYCOMBO_SELECT_OPTION } from '../../../lib'
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
                    'Choose program indicators and assign category combinations and category mappings to be used for disaggregation.'
                )}
            </StandardFormSectionDescription>
            <ModelSingleSelect<DisplayableModel>
                query={{
                    resource: 'programIndicators',
                    params: {
                        fields: [
                            'id',
                            'name',
                            'displayName',
                            'categoryCombo[id]',
                        ],
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
                {programIndicators.map((indicator) => (
                    <ProgramIndicatorCard
                        programIndicator={indicator}
                        key={indicator.id}
                        initiallyExpanded={
                            !initialProgramIndicators
                                .map(({ id }) => id)
                                .includes(indicator.id)
                        }
                    />
                ))}
            </div>
        </SectionedFormSection>
    )
}

const ProgramIndicatorCard = ({
    programIndicator,
    initiallyExpanded = false,
}: {
    programIndicator: DisplayableModel
    initiallyExpanded?: boolean
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
            initiallyExpanded={initiallyExpanded}
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

const addDefaultCategoryComboTransform = (
    results: CategoryComboFromSelect[]
) => {
    return [
        DEFAULT_CATEGORYCOMBO_SELECT_OPTION as CategoryComboFromSelect,
        ...results,
    ]
}

export const ProgramIndicatorMapping = ({
    programIndicator,
}: {
    programIndicator: DisplayableModel
}) => {
    const categoryCombo = useField(
        `programIndicatorMappings.${programIndicator.id}.categoryCombo`
    )
    const categoryComboInput = categoryCombo.input.value
        ? categoryCombo.input
        : { ...categoryCombo.input, value: DEFAULT_CATEGORYCOMBO_SELECT_OPTION }

    const attributeCombo = useField(
        `programIndicatorMappings.${programIndicator.id}.attributeCombo`
    )
    const attributeComboInput = attributeCombo.input.value
        ? attributeCombo.input
        : {
              ...attributeCombo.input,
              value: DEFAULT_CATEGORYCOMBO_SELECT_OPTION,
          }

    return (
        <div className={css.mappingFields}>
            <div>
                <ModelSingleSelectField<CategoryComboFromSelect>
                    label="Disaggregation category combination"
                    query={{
                        resource: 'categoryCombos',
                        params: {
                            filter: [
                                'dataDimensionType:eq:DISAGGREGATION',
                                'name:neq:default',
                            ],
                            fields: categoryComboFieldFilter.concat(),
                        },
                    }}
                    showNoValueOption={false}
                    transform={addDefaultCategoryComboTransform}
                    input={categoryComboInput}
                    meta={categoryCombo.meta}
                />
                <div className={css.mappingList}>
                    {categoryComboInput.value?.categories?.map(
                        (category: DisplayableModel) => {
                            if (
                                category.id ===
                                DEFAULT_CATEGORYCOMBO_SELECT_OPTION
                                    .categories[0].id
                            ) {
                                return (
                                    <div
                                        key={
                                            'aggregateExportCategoryOptionCombo_field'
                                        }
                                    >
                                        <StandardFormField>
                                            <Field
                                                name={`programIndicatorMappings.${programIndicator.id}.aggregateExportCategoryOptionCombo`}
                                                key={`programIndicatorMappings.${programIndicator.id}.aggregateExportCategoryOptionCombo`}
                                                label={i18n.t(
                                                    'Category option combination for aggregate data export'
                                                )}
                                                component={InputFieldFF}
                                            />
                                        </StandardFormField>
                                    </div>
                                )
                            }
                            return (
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
                        }
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
                    showNoValueOption={false}
                    input={attributeComboInput}
                    meta={attributeCombo.meta}
                    transform={addDefaultCategoryComboTransform}
                />
                <div className={css.mappingList}>
                    {attributeComboInput.value?.categories?.map(
                        (category: DisplayableModel) => {
                            if (
                                category.id ===
                                DEFAULT_CATEGORYCOMBO_SELECT_OPTION
                                    .categories[0].id
                            ) {
                                return (
                                    <div
                                        key={
                                            'aggregateExportAttributeOptionCombo_field'
                                        }
                                    >
                                        <StandardFormField>
                                            <Field
                                                name={`programIndicatorMappings.${programIndicator.id}.aggregateExportAttributeOptionCombo`}
                                                key={`programIndicatorMappings.${programIndicator.id}.aggregateExportAttributeOptionCombo`}
                                                label={i18n.t(
                                                    'Attribute option combination for aggregate data export'
                                                )}
                                                component={InputFieldFF}
                                            />
                                        </StandardFormField>
                                    </div>
                                )
                            }
                            return (
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
                        }
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

    const categoryMappingLabelPrefix = i18n.t(`Category mapping: `, {
        nsSeparator: '~-~',
    })

    return (
        <div>
            <div className={css.mappingSelectWrapper}>
                <SingleSelectField
                    label={`${categoryMappingLabelPrefix} ${category.displayName}`}
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
