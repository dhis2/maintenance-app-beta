import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { useValidator } from '../../../../../lib/models/useFieldValidators'
import { stageSchemaSection } from '../StageForm'

export function DueDateLabelField() {
    const validator = useValidator({
        schemaSection: stageSchemaSection,
        property: 'dueDateLabel',
    })

    return (
        <FieldRFF
            component={InputFieldFF}
            name="dueDateLabel"
            inputWidth="400px"
            label={i18n.t('Custom label for due date')}
            dataTest="formfields-dueDateLabel"
            validate={validator}
        />
    )
}
