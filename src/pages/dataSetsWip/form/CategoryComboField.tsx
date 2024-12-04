import i18n from '@dhis2/d2-i18n'
import { Field, InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'

export function CategoryComboField() {
    const validate = () => {}
    const { input, meta } = useField('categoryCombo', {
        validateFields: [],
        validate,
        format: (categoryCombo) => categoryCombo && categoryCombo.id,
        parse: (id) => ({ id }),
    })
    return (
        <FieldRFF<string | undefined>
            component={InputFieldFF}
            inputWidth="400px"
            label={i18n.t('{{fieldLabel}} (required)', {
                fieldLabel: i18n.t('Category combination'),
            })}
            name="categoryCombo.id"
        />
    )
}
