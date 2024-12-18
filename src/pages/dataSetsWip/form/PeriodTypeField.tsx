import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'

export function PeriodTypeField() {
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
            label={i18n.t('Period type')}
            name="periodType"
        />

        // <Field
        //     required
        //     name="periodType"
        //     label={i18n.t('{{fieldLabel}} (required)', {
        //         fieldLabel: i18n.t('Period type'),
        //     })}
        //     error={meta.touched && !!meta.error}
        //     validationText={meta.touched ? meta.error : undefined}
        // >
        //
        //     <ModelSingleSelect
        //         required
        //         useInitialOptionQuery={useInitialCategoryComboQuery}
        //         useOptionsQuery={useCategoryCombosQuery}
        //         invalid={meta.touched && !!meta.error}
        //         selected={input.value}
        //         onChange={({ selected }) => {
        //             input.onChange(selected)
        //             input.onBlur()
        //         }}
        //         onBlur={input.onBlur}
        //         onFocus={input.onFocus}
        //         />
        // </Field>
    )
}
