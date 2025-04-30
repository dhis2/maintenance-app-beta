import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, IconInfo16, IconWarningFilled16 } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo, useState } from 'react'
import { useField, useForm, useFormState } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import {
    CollapsibleCard,
    CollapsibleCardHeader,
    CollapsibleCardTitle,
    SectionedFormSection,
    StandardFormSectionTitle,
} from '../../../components'
import { generateDhis2Id, useBoundResourceQueryFn } from '../../../lib'
import { CategoriesSelector } from './CategoriesSelector'
import { CategoryMapping } from './CategoryMapping'
import css from './DissaggregationCategories.module.css'

type CategoryOption = {
    id: string
    displayName: string
}

type CategoryComboResponse = {
    categoryCombos: {
        id: string
        displayName: string
        categories: {
            id: string
            displayName: string
            categoryOptions: CategoryOption[]
        }[]
    }[]
}

type CategoryObject = Record<
    string,
    {
        id: string
        displayName: string
        categoryOptions: { id: string; displayName: string }[]
    }
>

const getCategoryObjects = (
    categoryCombosData: CategoryComboResponse | undefined
) => {
    if (!categoryCombosData) {
        return {
            categoryCombosToCategoriesObject: {},
            categoryObject: {},
            categoriesArray: [],
            categoryCombosArray: [],
        }
    }
    const categoryCombosToCategoriesObject =
        categoryCombosData?.categoryCombos?.reduce((ccToCat, cCombo) => {
            return {
                ...ccToCat,
                [cCombo.id]: cCombo.categories.map((category) => category.id),
            }
        }, {} as Record<string, string[]>)

    const categoryObject = categoryCombosData?.categoryCombos?.reduce(
        (allCategories, catCombo) => {
            catCombo.categories.forEach((category) => {
                if (!allCategories[category.id]) {
                    allCategories[category.id] = category
                }
            })
            return allCategories
        },
        {} as CategoryObject
    )
    const categoriesArray = Object.values(categoryObject || {}).sort((a, b) =>
        a?.displayName?.localeCompare(b?.displayName)
    )
    const categoryCombosArray =
        categoryCombosData?.categoryCombos?.map((catCombo) => ({
            id: catCombo.id,
            displayName: catCombo.displayName,
        })) || []

    return {
        categoryCombosToCategoriesObject,
        categoryObject,
        categoriesArray,
        categoryCombosArray,
    }
}

type optionsMappingArray = Record<string, { optionId: string; filter: string }>
const getEmptyOptionValues = (categoryOptions: CategoryOption[]) => {
    return categoryOptions?.reduce(
        (optionObject: optionsMappingArray, option: CategoryOption) => {
            optionObject[option.id] = {
                optionId: option.id,
                filter: '',
            }
            return optionObject
        },
        {} as optionsMappingArray
    )
}

type ProgramIndicatorValue = Record<
    string,
    {
        categoryCombo: {
            categories: { id: string }[]
        }
    }
>

const useProgramIndicatorSelectionCategories = (
    categoriesWithMappings: string[]
) => {
    const programIndicatorsValue: ProgramIndicatorValue = useField(
        'programIndicatorMappings'
    )?.input?.value
    const programCategories = Object.values(programIndicatorsValue)
        ?.map((piValue) => {
            return piValue?.categoryCombo?.categories
        })
        ?.flat()
        ?.map((category) => category?.id)
    return [...new Set(programCategories)].filter(
        (id) => !categoriesWithMappings.includes(id)
    )
}

export const DisaggregationCategories = () => {
    const formApi = useForm()

    // this is to have a stable-ish reference instead of taking from formState (rethink)
    const { initialValues } = useFormState()
    const [categoriesWithMappings, setCategoriesWithMappings] = useState<
        string[]
    >([])

    useEffect(() => {
        setCategoriesWithMappings(
            Object.keys(initialValues?.categoryMappings || {})
        )
    }, [initialValues.categoryMappings])

    const [addedCategories, setAddedCategories] = useState<string[]>([])

    const categoriesFromProgramIndicatorSelections =
        useProgramIndicatorSelectionCategories(categoriesWithMappings)

    const queryFn = useBoundResourceQueryFn()
    const query = {
        resource: 'categoryCombos',
        params: {
            paging: false,
            fields: [
                'id',
                'displayName',
                'categories[id,displayName,categoryOptions[id,displayName]]',
            ],
            filters: ['name:neq:default'],
        },
    }
    const categoryCombos = useQuery({
        queryKey: [query],
        queryFn: queryFn<CategoryComboResponse>,
    })

    const {
        categoryCombosToCategoriesObject,
        categoryObject,
        categoriesArray,
        categoryCombosArray,
    } = useMemo(() => {
        return getCategoryObjects(categoryCombos.data)
    }, [categoryCombos.data])

    const { show: showNotification } = useAlert((message) => message)

    if (categoryCombos.isLoading) {
        return null
    }

    if (categoryCombos?.data?.categoryCombos?.length === 0) {
        return (
            <div>
                {i18n.t(
                    'There are no category combinations. Your system must have at least one category combination in order to disaggregate a program indicator.'
                )}
            </div>
        )
    }

    const addSingleCategory = (categoryId: string) => {
        if (categoriesWithMappings.includes(categoryId)) {
            return
        }
        const options = getEmptyOptionValues(
            categoryObject?.[categoryId]?.categoryOptions
        )

        formApi.change(`categoryMappings.${categoryId}`, [
            {
                categoryId: categoryId,
                id: generateDhis2Id(),
                mappingName: 'Standard mapping',
                options: options,
                deleted: false,
            },
        ])

        setAddedCategories((prev) => [...prev, categoryId])
        setCategoriesWithMappings((prev) => [categoryId, ...prev])
    }

    const addCategory = (categoryId: string) => {
        if (categoriesWithMappings.includes(categoryId)) {
            showNotification(i18n.t('No new categories to add'))
            return
        }
        addSingleCategory(categoryId)
        showNotification(i18n.t('One category added'))
    }

    const addCategoryCombo = (categoryComboId: string) => {
        const categories = categoryCombosToCategoriesObject?.[categoryComboId]
        const notAlreadyAddedCategories = categories.filter(
            (categoryId) => !categoriesWithMappings.includes(categoryId)
        )
        if (notAlreadyAddedCategories.length === 0) {
            showNotification(i18n.t('No new categories to add'))
        }
        if (categories) {
            categories.forEach((categoryId: string) => {
                addSingleCategory(categoryId)
            })
        }
        if (categories.length === notAlreadyAddedCategories.length) {
            showNotification(
                i18n.t('{{newlyAddedCount}} categories added', {
                    newlyAddedCount: categories.length,
                })
            )
        } else {
            showNotification(
                i18n.t(
                    '{{newlyAddedCount}} categories added ({{alreadyAddedCount}} already in the list)',
                    {
                        newlyAddedCount: notAlreadyAddedCategories.length,
                        alreadyAddedCount:
                            categories.length -
                            notAlreadyAddedCategories.length,
                    }
                )
            )
        }
    }

    return (
        <SectionedFormSection name="disaggregationCategories">
            <StandardFormSectionTitle>
                {i18n.t('Disaggregation categories')}
            </StandardFormSectionTitle>
            <CategoriesSelector
                categoryCombos={categoryCombosArray}
                categories={categoriesArray}
                addCategory={addCategory}
                addCategoryCombo={addCategoryCombo}
                categoriesWithMappings={categoriesWithMappings}
            />
            {categoriesFromProgramIndicatorSelections.map((id) => (
                <SuggestedCategory
                    key={id}
                    id={id}
                    categoryObject={categoryObject}
                    addCategory={addCategory}
                />
            ))}
            <div className={css.collapsibleCardWrapper}>
                {categoriesWithMappings.map((id) => (
                    <DisaggregationCategory
                        key={id}
                        id={id}
                        categoryObject={categoryObject}
                        initiallyExpanded={addedCategories.includes(id)}
                    />
                ))}
            </div>
        </SectionedFormSection>
    )
}

type SuggestedCategoryProps = {
    id: string
    categoryObject: CategoryObject
    addCategory: (id: string) => void
}

const SuggestedCategory = ({
    id,
    categoryObject,
    addCategory,
}: SuggestedCategoryProps) => (
    <div className={css.categoryCardSuggested}>
        <div>
            <span className={css.categoryText}>
                {i18n.t('Category:', { nsSeparator: '~:~' })}
            </span>
            <span>&nbsp;</span>
            <span className={css.categoryName}>
                {categoryObject?.[id]?.displayName}
            </span>
        </div>
        <div className={css.suggestedExplanationText}>
            <span>
                <IconInfo16 />
            </span>
            {i18n.t('Suggested based on Program Indicator selections')}
        </div>
        <Button
            small
            onClick={() => {
                addCategory(id)
            }}
        >
            {i18n.t('Add category')}
        </Button>
    </div>
)

type DisaggregationCategoryProps = {
    id: string
    categoryObject: CategoryObject
    initiallyExpanded?: boolean
}
export const DisaggregationCategory = ({
    id,
    categoryObject,
    initiallyExpanded = false,
}: DisaggregationCategoryProps) => {
    const array = useFieldArray(`categoryMappings.${id}`)

    const showSoftDelete =
        array.fields.value.filter((val) => !val.deleted).length > 1

    const { input: categoryMappingsDeleted } = useField(
        'categoryMappings.deleted'
    )

    const someMappingInvalid = useMemo(() => {
        return array.fields.value.some((catMappings) =>
            Object.values(catMappings.options).some(
                (optionMapping) =>
                    (optionMapping as { invalid: boolean }).invalid
            )
        )
    }, [array])

    const isDeleted = categoryMappingsDeleted.value.includes(id)
    const categoryDisplayName = categoryObject?.[id]?.displayName

    if (isDeleted) {
        return (
            <div className={css.categoryCardDeleted}>
                <div className={css.deletedCategoryText}>
                    {i18n.t(
                        '{{- categoryName}} and all mappings will be deleted on save',
                        { categoryName: categoryDisplayName }
                    )}
                </div>

                <Button
                    small
                    onClick={() => {
                        categoryMappingsDeleted.onChange(
                            categoryMappingsDeleted.value.filter(
                                (deletedId: string) => deletedId !== id
                            )
                        )
                    }}
                >
                    {i18n.t('Undo delete')}
                </Button>
            </div>
        )
    }

    return (
        <CollapsibleCard
            initiallyExpanded={initiallyExpanded}
            style={{ backgroundColor: 'var(--colors-grey100)' }}
            headerElement={
                <CollapsibleCardHeader>
                    <CollapsibleCardTitle
                        prefix={i18n.t('Category:')}
                        title={categoryDisplayName}
                        icon={
                            someMappingInvalid ? (
                                <IconWarningFilled16 color="var(--colors-yellow600)" />
                            ) : null
                        }
                    />
                    <Button
                        small
                        secondary
                        destructive
                        onClick={() => {
                            categoryMappingsDeleted.onChange([
                                ...(categoryMappingsDeleted.value || []),
                                id,
                            ])
                        }}
                    >
                        {i18n.t('Remove category')}
                    </Button>
                </CollapsibleCardHeader>
            }
        >
            {array.fields.map((fieldName) => (
                <div key={fieldName}>
                    <CategoryMapping
                        fieldName={fieldName}
                        categoryOptionArray={
                            categoryObject?.[id]?.categoryOptions ?? []
                        }
                        showSoftDelete={showSoftDelete}
                    />
                </div>
            ))}

            <Button
                small
                onClick={() => {
                    array.fields.push({
                        categoryId: id,
                        id: generateDhis2Id(),
                        mappingName:
                            'Mapping ' + ((array?.fields?.length ?? 0) + 1),
                        options: getEmptyOptionValues(
                            categoryObject?.[id]?.categoryOptions
                        ),
                        deleted: false,
                    })
                }}
            >
                {i18n.t('Add mapping')}
            </Button>
        </CollapsibleCard>
    )
}
