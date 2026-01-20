import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'

export function HideDueDateField() {
    return (
        <FieldRFF
            name="hideDueDate"
            type="checkbox"
            component={CheckboxFieldFF as any}
            label={i18n.t('Show scheduled date')}
            dataTest="formfields-hideDueDate"
            format={(value: boolean | undefined) => !value}
            parse={(value: boolean | undefined) => !value}
        />
    )
}
