import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ModelSingleSelectField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { DEFAULT_CATEGORY_COMBO } from '../../../lib'

const CATEGORY_COMBOS_QUERY = {
    resource: 'categoryCombos',
    params: {
        filter: ['dataDimensionType:eq:ATTRIBUTE'],
    },
}

const DEFAULT_CATEGORY_SELECT_OPTION = {
    id: DEFAULT_CATEGORY_COMBO.id,
    displayName: DEFAULT_CATEGORY_COMBO.displayName,
}

export function CategoryComboField() {
    return (
        <ModelSingleSelectField
            required
            name="categoryCombo"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Category combination'),
            })}
            query={CATEGORY_COMBOS_QUERY}
            transform={(catCombos) => [
                DEFAULT_CATEGORY_SELECT_OPTION,
                ...catCombos,
            ]}
        />
    )
}
