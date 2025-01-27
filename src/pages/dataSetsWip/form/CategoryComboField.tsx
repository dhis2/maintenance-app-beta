import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    ModelSingleSelect,
    ModelSingleSelectField,
    ModelSingleSelectProps,
} from '../../../components/metadataFormControls/ModelSingleSelect'
import { DEFAULT_CATEGORY_COMBO } from '../../../lib'
import { PlainResourceQuery } from '../../../types'
import { DisplayableModel } from '../../../types/models'

const CATEGORY_COMBOS_QUERY = {
    resource: 'categoryCombos',
    params: {
        filter: ['dataDimensionType:eq:ATTRIBUTE'],
    },
}

const DEFAULT_CATEGORYCOMBO_SELECT_OPTION = {
    id: DEFAULT_CATEGORY_COMBO.id,
    displayName: DEFAULT_CATEGORY_COMBO.displayName,
}

const addDefaultCategoryComboTransform = <TCatCombo extends DisplayableModel>(
    catCombos: TCatCombo[]
) => [DEFAULT_CATEGORYCOMBO_SELECT_OPTION as TCatCombo, ...catCombos]

export function CategoryComboField() {
    return (
        <ModelSingleSelectField
            required
            name="categoryCombo"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Category combination'),
            })}
            query={CATEGORY_COMBOS_QUERY}
            transform={addDefaultCategoryComboTransform}
        />
    )
}

export type CategoryComboSelectProps<TCatCombo extends DisplayableModel> = Omit<
    ModelSingleSelectProps<TCatCombo>,
    'query'
> & {
    query: Omit<PlainResourceQuery, 'resource'>
}

const mergeWithDefaultQuery = (
    query: Omit<PlainResourceQuery, 'resource'>
) => ({
    resource: 'categoryCombos',
    ...query,
    params: {
        ...query.params,
        filter: ['isDefault:eq:false'].concat(query.params?.filter || []),
    },
})

export const CategoryComboSelect = <TCatCombo extends DisplayableModel>(
    props: CategoryComboSelectProps<TCatCombo>
) => {
    const query = mergeWithDefaultQuery(props.query)
    return (
        <ModelSingleSelect
            showNoValueOption
            transform={addDefaultCategoryComboTransform}
            {...props}
            query={query}
        />
    )
}
