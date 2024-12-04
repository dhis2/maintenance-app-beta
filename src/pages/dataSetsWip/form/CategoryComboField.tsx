import i18n from '@dhis2/d2-i18n'
import { Field } from '@dhis2/ui'
import React from 'react'
import { useField } from 'react-final-form'
import { ModelSingleSelect } from '../../../components/metadataFormControls/ModelSingleSelect'
import { DEFAULT_CATEGORY_COMBO } from '../../../lib'

export function CategoryComboField() {
    const { input, meta } = useField('categoryCombo')

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

    return (
        <Field
            required
            name="categoryCombo"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Category combination'),
            })}
            error={meta.touched && !!meta.error}
            validationText={meta.touched ? meta.error : undefined}
        >
            <ModelSingleSelect
                selected={input.value}
                query={CATEGORY_COMBOS_QUERY}
                invalid={meta.touched && !!meta.error}
                onChange={(selected) => {
                    input.onChange(selected)
                }}
                transform={(catCombos) => [
                    ...catCombos,
                    DEFAULT_CATEGORY_SELECT_OPTION,
                ]}
            />
        </Field>
    )
}
