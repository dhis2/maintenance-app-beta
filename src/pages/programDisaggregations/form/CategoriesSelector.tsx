import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import css from './CategoriesSelector.module.css'

type DisplayIdNameArray = { id: string; displayName: string }[]

export const CategoriesSelector = ({
    categoryCombos,
    categories,
    categoriesWithMappings,
    addCategory,
    addCategoryCombo,
}: {
    categoryCombos: DisplayIdNameArray
    categories: DisplayIdNameArray
    categoriesWithMappings: string[]
    addCategory: (id: string) => void
    addCategoryCombo: (id: string) => void
}) => {
    return (
        <>
            <div className={css.selectorContainer}>
                <SingleSelectField
                    label={i18n.t('Add a category')}
                    onChange={(e) => {
                        addCategory(e.selected)
                    }}
                >
                    {categories.map((category) => (
                        <SingleSelectOption
                            key={category.id}
                            label={category.displayName}
                            value={category.id}
                            disabled={categoriesWithMappings.includes(
                                category.id
                            )}
                        />
                    ))}
                </SingleSelectField>
            </div>
            <div className={css.selectorContainer}>
                <SingleSelectField
                    label={i18n.t('Add categories from a category combination')}
                    onChange={(e) => {
                        addCategoryCombo(e.selected)
                    }}
                >
                    {categoryCombos.map((categoryCombo) => (
                        <SingleSelectOption
                            key={categoryCombo.id}
                            label={categoryCombo.displayName}
                            value={categoryCombo.id}
                        />
                    ))}
                </SingleSelectField>
            </div>
        </>
    )
}
