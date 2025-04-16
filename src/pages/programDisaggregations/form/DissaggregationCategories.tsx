import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    IconChevronDown24,
    IconChevronRight24,
    IconInfo16,
} from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo, useState } from 'react'
import { useField, useForm, useFormState } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import { StandardFormSectionTitle } from '../../../components'
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

// const getCategoriesFromProgramIndicatorSelections = (
//     programIndicatorsValue: ProgramIndicatorValue,
//     categoriesWithMappings: string[]
// ) => {
//     const programCategories = Object.values(programIndicatorsValue)
//         ?.map((piValue) => {
//             return piValue?.categoryCombo?.categories
//         })
//         ?.flat()
//         ?.map((category) => category?.id)
//     return [...new Set(programCategories)].filter(
//         (id) => !categoriesWithMappings.includes(id)
//     )
// }

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
        // remove later styling, just to give proper colour
        <div className={css.tempContainer}>
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
            {categoriesWithMappings.map((id) => (
                <DisaggregationCategory
                    key={id}
                    id={id}
                    categoryObject={categoryObject}
                    initiallyExpanded={addedCategories.includes(id)}
                />
            ))}
        </div>
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

const DisaggregationCategory = ({
    id,
    categoryObject,
    initiallyExpanded,
}: {
    id: string
    categoryObject: CategoryObject
    initiallyExpanded?: boolean
}) => {
    const array = useFieldArray(`categoryMappings.${id}`)
    const { input: categoryMappingsDeleted } = useField(
        'categoryMappings.deleted'
    )
    const [isExpanded, setIsExpanded] = useState<boolean>(
        initiallyExpanded || false
    )
    const isDeleted = categoryMappingsDeleted.value.includes(id)

    if (isDeleted) {
        return (
            <div className={css.categoryCardDeleted}>
                <div className={css.deletedCategoryText}>
                    {i18n.t(
                        '{{- categoryName}} and all mappings will be deleted on save',
                        { categoryName: categoryObject?.[id]?.displayName }
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
        <div className={css.categoryCard}>
            <div className={css.categoryHeader}>
                <div className={css.categoryTitleContainer}>
                    <span onClick={() => setIsExpanded((prev) => !prev)}>
                        {isExpanded ? (
                            <IconChevronDown24 />
                        ) : (
                            <IconChevronRight24 />
                        )}
                    </span>
                    <span className={css.categoryText}>
                        {i18n.t('Category:')}
                    </span>
                    <span>&nbsp;</span>
                    <span className={css.categoryName}>
                        {categoryObject?.[id]?.displayName}
                    </span>
                </div>

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
                    {i18n.t('Remove')}
                </Button>
            </div>
            {isExpanded &&
                array.fields.map((fieldName, index) => {
                    return (
                        <div key={fieldName}>
                            <CategoryMapping
                                fieldName={fieldName}
                                categoryOptionArray={
                                    categoryObject?.[id]?.categoryOptions ?? []
                                }
                                showSoftDelete={index !== 0}
                            />
                        </div>
                    )
                })}

            {isExpanded && (
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
            )}
        </div>
    )
}
